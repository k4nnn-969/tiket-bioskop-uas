export type BookingOrder = {
  id: string;
  showDate: string;
  showTime: string;
  seats: string[];
  subtotal: number;
  serviceFee: number;
  total: number;
  paymentMethod: string | null;
  status: "pending" | "paid";
  expiresAt: number;
  createdAt: string;
  paidAt: string | null;
};
