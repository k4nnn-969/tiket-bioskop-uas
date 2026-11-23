import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const showtime = id === "default"
      ? await prisma.showtime.findFirst({
          orderBy: [{ showDate: "asc" }, { showTime: "asc" }],
          include: { bookedSeats: { select: { seatNumber: true } } },
        })
      : await prisma.showtime.findUnique({
          where: { id },
          include: { bookedSeats: { select: { seatNumber: true } } },
        });

    if (!showtime) return NextResponse.json({ error: "Jadwal tidak ditemukan. Jalankan prisma db seed terlebih dahulu." }, { status: 404 });
    const { bookedSeats, ...details } = showtime;
    return NextResponse.json({ ...details, occupiedSeats: bookedSeats.map(({ seatNumber }) => seatNumber) });
  } catch (error) {
    console.error("Failed to load showtime:", error);
    return NextResponse.json({ error: "Jadwal tidak dapat dimuat. Periksa koneksi database." }, { status: 500 });
  }
}
