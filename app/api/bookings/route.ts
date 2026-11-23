import { randomInt } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const validSeat = /^[A-F][1-8]$/;
const paymentMethods = new Set(["m-tix-balance", "qris", "virtual-account"]);

type BookingPayload = {
  showtimeId?: unknown;
  selectedSeats?: unknown;
  paymentMethod?: unknown;
};

function isSeatList(value: unknown): value is string[] {
  return Array.isArray(value) &&
    value.length >= 1 &&
    value.length <= 6 &&
    value.every((seat) => typeof seat === "string" && validSeat.test(seat)) &&
    new Set(value).size === value.length;
}

function getPrismaError(error: unknown): { code: string; target?: unknown } | null {
  if (typeof error !== "object" || error === null || !("code" in error) || typeof error.code !== "string") return null;
  const meta = "meta" in error && typeof error.meta === "object" && error.meta !== null ? error.meta : undefined;
  const target = meta && "target" in meta ? meta.target : undefined;
  return { code: error.code, target };
}

function isBookingCodeCollision(error: unknown) {
  const prismaError = getPrismaError(error);
  if (!prismaError || prismaError.code !== "P2002") return false;
  return Array.isArray(prismaError.target)
    ? prismaError.target.includes("bookingCode")
    : String(prismaError.target).includes("bookingCode");
}

export async function POST(request: Request) {
  let body: BookingPayload;
  try {
    body = (await request.json()) as BookingPayload;
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const { showtimeId, selectedSeats, paymentMethod } = body;
  if (
    typeof showtimeId !== "string" ||
    !isSeatList(selectedSeats) ||
    typeof paymentMethod !== "string" ||
    !paymentMethods.has(paymentMethod)
  ) {
    return NextResponse.json({ error: "Jadwal, kursi, atau metode pembayaran tidak valid." }, { status: 400 });
  }

  try {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const bookingCode = randomInt(100000, 1000000).toString();
      try {
        const result = await prisma.$transaction(async (transaction: Prisma.TransactionClient) => {
          const showtime = await transaction.showtime.findUnique({
            where: { id: showtimeId },
            include: { bookedSeats: { where: { seatNumber: { in: selectedSeats } }, select: { seatNumber: true } } },
          });
          if (!showtime) throw new Error("SHOWTIME_NOT_FOUND");
          if (showtime.bookedSeats.length > 0) throw new Error("SEAT_TAKEN");

          const totalAmount = selectedSeats.length * (showtime.ticketPrice + showtime.adminFee);
          const created = await transaction.booking.create({
            data: {
              bookingCode,
              showtimeId,
              paymentMethod,
              totalAmount,
              status: "PAID",
            },
          });
          await transaction.bookedSeat.createMany({
            data: selectedSeats.map((seatNumber) => ({ seatNumber, showtimeId, bookingId: created.id })),
          });
          return {
            booking: created,
            showtime: {
              id: showtime.id,
              movieTitle: showtime.movieTitle,
              rating: showtime.rating,
              cinema: showtime.cinema,
              studio: showtime.studio,
              showDate: showtime.showDate,
              showTime: showtime.showTime,
              ticketPrice: showtime.ticketPrice,
              adminFee: showtime.adminFee,
            },
          };
        });

        return NextResponse.json({ ...result.booking, showtime: result.showtime, seats: selectedSeats }, { status: 201 });
      } catch (error) {
        if (error instanceof Error && error.message === "SHOWTIME_NOT_FOUND") {
          return NextResponse.json({ error: "Jadwal tayang tidak ditemukan." }, { status: 404 });
        }
        if (error instanceof Error && error.message === "SEAT_TAKEN") {
          return NextResponse.json({ error: "Kursi baru saja dipesan orang lain. Perbarui pilihan kursi dan coba lagi." }, { status: 409 });
        }
        if (isBookingCodeCollision(error)) continue;
        if (getPrismaError(error)?.code === "P2002") {
          return NextResponse.json({ error: "Kursi baru saja dipesan orang lain. Perbarui pilihan kursi dan coba lagi." }, { status: 409 });
        }
        throw error;
      }
    }
    console.error("Could not generate a unique booking code after five attempts.");
    return NextResponse.json({ error: "Kode booking gagal dibuat. Silakan coba kembali." }, { status: 503 });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json({ error: "Pemesanan gagal disimpan. Periksa koneksi database." }, { status: 500 });
  }
}
