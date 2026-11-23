import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const showtime = await prisma.showtime.upsert({
    where: { id: "showtime-default" },
    update: {},
    create: {
      id: "showtime-default",
      movieTitle: "Senja Terakhir",
      rating: "R13+",
      cinema: "PLAZA SENAYAN XXI",
      studio: "Studio 3",
      showDate: "2026-11-24",
      showTime: "19:45",
      ticketPrice: 50000,
      adminFee: 4000,
    },
  });

  const sampleBooking = await prisma.booking.upsert({
    where: { bookingCode: "120001" },
    update: {},
    create: {
      id: "booking-seed",
      bookingCode: "120001",
      showtimeId: showtime.id,
      paymentMethod: "qris",
      totalAmount: 162000,
      status: "PAID",
    },
  });

  const sampleSeatNumbers = ["A3", "C5", "F7"];
  const existingSeats = await prisma.bookedSeat.findMany({
    where: { showtimeId: showtime.id, seatNumber: { in: sampleSeatNumbers } },
    select: { seatNumber: true },
  });
  const existingSeatNumbers = new Set(existingSeats.map(({ seatNumber }) => seatNumber));
  const missingSeats = sampleSeatNumbers.filter((seatNumber) => !existingSeatNumbers.has(seatNumber));
  if (missingSeats.length > 0) {
    await prisma.bookedSeat.createMany({
      data: missingSeats.map((seatNumber) => ({
      seatNumber,
      showtimeId: showtime.id,
      bookingId: sampleBooking.id,
      })),
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error("Prisma seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
