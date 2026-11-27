import assert from "node:assert/strict";
import { test } from "node:test";
import { getLocalUser, updateLocalProfile, logoutLocalUser } from "./local-auth";
import { readBookingReferences, rememberBooking } from "./local-bookings";

test("local profile and booking index preserve credentials and isolate owners", () => {
  const data = new Map<string, string>();
  const target = new EventTarget();
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    localStorage: { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => data.set(key, value), removeItem: (key: string) => data.delete(key) },
    dispatchEvent: target.dispatchEvent.bind(target),
  } });
  try {
    data.set("tix_users", JSON.stringify([{ name: "User One", email: "one@example.com", salt: "salt", passwordHash: "hash" }]));
    data.set("tix_current_user", "one@example.com");
    assert.equal(getLocalUser()?.name, "User One");
    assert.throws(() => updateLocalProfile("A", ""), /2–80/);
    assert.throws(() => updateLocalProfile("User One", "abc"), /telepon/);
    const user = updateLocalProfile(" Updated Name ", "+628123456789");
    assert.equal(user.name, "Updated Name");
    assert.equal(getLocalUser()?.phone, "+628123456789");
    assert.equal(JSON.parse(data.get("tix_users")!)[0].passwordHash, "hash");
    rememberBooking("booking-1", user);
    rememberBooking("booking-1", user);
    assert.equal(readBookingReferences(user).length, 1);
    assert.equal(readBookingReferences(user)[0].customerName, "Updated Name");
    assert.deepEqual(readBookingReferences(null), []);
    assert.deepEqual(readBookingReferences({ name: "Other", email: "other@example.com" }), []);
    rememberBooking("guest-booking", null);
    assert.equal(readBookingReferences(null)[0].id, "guest-booking");
    logoutLocalUser();
    assert.equal(getLocalUser(), null);
    assert.throws(() => updateLocalProfile("User", ""), /login/);
    data.set("tix_booking_ids:guest", "{}");
    assert.throws(() => readBookingReferences(null), /Riwayat/);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});