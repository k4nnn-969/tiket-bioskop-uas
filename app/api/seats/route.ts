import { NextResponse } from "next/server";
import database from "@/lib/db";

export const runtime = "nodejs";

const blockedSeats = ["A3", "C5", "F7"];

export function GET(request: Request) {
  const showtimeKey = new URL(request.url).searchParams.get("showtime");
  if (!showtimeKey || !/^\d{4}-\d{2}-\d{2}\|(13:15|16:30|19:45)$/.test(showtimeKey)) {
    return NextResponse.json({ error: "Jadwal tidak valid." }, { status: 400 });
  }

  const now = Date.now();
  database.prepare("DELETE FROM orders WHERE status = 'pending' AND expires_at <= ?").run(now);
  const reserved = database
    .prepare("SELECT seat_label FROM order_seats WHERE showtime_key = ?")
    .all(showtimeKey) as Array<{ seat_label: string }>;

  return NextResponse.json({
    seats: [...blockedSeats, ...reserved.map((seat) => seat.seat_label)],
  });
}
