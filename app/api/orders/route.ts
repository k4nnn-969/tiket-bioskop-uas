import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import database from "@/lib/db";

export const runtime = "nodejs";

const seatPrice = 50_000;
const serviceFeePerSeat = 5_000;
const availableSeats = /^[A-G][1-8]$/;
const blockedSeats = new Set(["A3", "C5", "F7"]);
const validShowtime = /^\d{4}-\d{2}-\d{2}\|(13:15|16:30|19:45)$/;

type CreateOrderBody = {
  showDate?: unknown;
  showTime?: unknown;
  seats?: unknown;
};

export async function POST(request: Request) {
  let body: CreateOrderBody;
  try {
    body = (await request.json()) as CreateOrderBody;
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const { showDate, showTime, seats } = body;
  const showtimeKey = `${String(showDate)}|${String(showTime)}`;
  if (
    typeof showDate !== "string" ||
    typeof showTime !== "string" ||
    !validShowtime.test(showtimeKey) ||
    !Array.isArray(seats) ||
    seats.length < 1 ||
    seats.length > 6 ||
    !seats.every((seat) => typeof seat === "string" && availableSeats.test(seat)) ||
    new Set(seats).size !== seats.length
  ) {
    return NextResponse.json({ error: "Jadwal atau pilihan kursi tidak valid." }, { status: 400 });
  }
  if (seats.some((seat: unknown) => typeof seat === "string" && blockedSeats.has(seat))) {
    return NextResponse.json({ error: "Salah satu kursi tidak tersedia." }, { status: 409 });
  }

  const id = randomUUID();
  const now = Date.now();
  const subtotal = seats.length * seatPrice;
  const serviceFee = seats.length * serviceFeePerSeat;

  try {
    const createOrder = database.transaction(() => {
      database.prepare("DELETE FROM orders WHERE status = 'pending' AND expires_at <= ?").run(now);
      database
        .prepare(
          `INSERT INTO orders (id, show_date, show_time, seat_count, subtotal, service_fee, expires_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(id, showDate, showTime, seats.length, subtotal, serviceFee, now + 15 * 60 * 1000);

      const addSeat = database.prepare(
        "INSERT INTO order_seats (order_id, showtime_key, seat_label) VALUES (?, ?, ?)",
      );
      for (const seat of seats) addSeat.run(id, showtimeKey, seat);
    });

    createOrder();
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "Kursi baru saja dipesan orang lain. Silakan pilih kursi yang berbeda." },
        { status: 409 },
      );
    }
    console.error("Failed to create booking order:", error);
    return NextResponse.json({ error: "Pesanan gagal disimpan. Silakan coba lagi." }, { status: 500 });
  }

  return NextResponse.json({ id }, { status: 201 });
}
