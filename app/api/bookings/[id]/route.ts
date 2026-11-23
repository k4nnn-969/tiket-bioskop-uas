import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        showtime: true,
        bookedSeats: { orderBy: { seatNumber: "asc" }, select: { seatNumber: true } },
      },
    });
    if (!booking) return NextResponse.json({ error: "E-Ticket tidak ditemukan." }, { status: 404 });
    const { bookedSeats, ...details } = booking;
    return NextResponse.json({ ...details, seats: bookedSeats.map(({ seatNumber }) => seatNumber) });
  } catch (error) {
    console.error("Failed to load booking:", error);
    return NextResponse.json({ error: "E-Ticket tidak dapat dimuat. Periksa koneksi database." }, { status: 500 });
  }
}
