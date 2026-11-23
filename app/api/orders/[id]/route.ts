import { NextResponse } from "next/server";
import database from "@/lib/db";

export const runtime = "nodejs";

type OrderRow = {
  id: string;
  show_date: string;
  show_time: string;
  seat_count: number;
  subtotal: number;
  service_fee: number;
  payment_method: string | null;
  status: "pending" | "paid";
  expires_at: number;
  created_at: string;
  paid_at: string | null;
};

type RouteContext = { params: Promise<{ id: string }> };

function findOrder(id: string) {
  const order = database.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
  if (!order) return null;

  const seats = database
    .prepare("SELECT seat_label FROM order_seats WHERE order_id = ? ORDER BY seat_label")
    .all(id) as Array<{ seat_label: string }>;

  return {
    id: order.id,
    showDate: order.show_date,
    showTime: order.show_time,
    seats: seats.map((seat) => seat.seat_label),
    subtotal: order.subtotal,
    serviceFee: order.service_fee,
    total: order.subtotal + order.service_fee,
    paymentMethod: order.payment_method,
    status: order.status,
    expiresAt: order.expires_at,
    createdAt: order.created_at,
    paidAt: order.paid_at,
  };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const order = findOrder(id);
  if (!order) return NextResponse.json({ error: "Pesanan tidak ditemukan atau sudah kedaluwarsa." }, { status: 404 });
  if (order.status === "pending" && order.expiresAt <= Date.now()) {
    database.prepare("DELETE FROM orders WHERE id = ?").run(id);
    return NextResponse.json({ error: "Waktu pembayaran habis. Silakan pesan kursi kembali." }, { status: 410 });
  }
  return NextResponse.json(order);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  let body: { paymentMethod?: unknown };
  try {
    body = (await request.json()) as { paymentMethod?: unknown };
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const methods = ["qris", "bank-transfer", "e-wallet"];
  if (typeof body.paymentMethod !== "string" || !methods.includes(body.paymentMethod)) {
    return NextResponse.json({ error: "Metode pembayaran tidak valid." }, { status: 400 });
  }

  const order = findOrder(id);
  if (!order) return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
  if (order.status === "paid") return NextResponse.json(order);
  if (order.expiresAt <= Date.now()) {
    database.prepare("DELETE FROM orders WHERE id = ?").run(id);
    return NextResponse.json({ error: "Waktu pembayaran habis. Silakan pesan kursi kembali." }, { status: 410 });
  }

  database
    .prepare(
      `UPDATE orders
       SET status = 'paid', payment_method = ?, paid_at = CURRENT_TIMESTAMP
       WHERE id = ? AND status = 'pending'`,
    )
    .run(body.paymentMethod, id);

  return NextResponse.json(findOrder(id));
}
