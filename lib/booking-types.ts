export type Showtime = {
  id: string;
  movieTitle: string;
  rating: string;
  cinema: string;
  studio: string;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  adminFee: number;
  occupiedSeats: string[];
};

export type ShowtimeResponse = Showtime;

export type PaidBooking = {
  id: string;
  bookingCode: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  showtime: Omit<Showtime, "occupiedSeats">;
  seats: string[];
};

export type BookingResponse = PaidBooking | { error: string };
