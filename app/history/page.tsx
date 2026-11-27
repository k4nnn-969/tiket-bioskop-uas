import type { Metadata } from "next";
import { BookingLibrary } from "@/components/booking-library";

export const metadata: Metadata = { title: "History | TIX ID" };
export default function Page() { return <BookingLibrary mode="history" />; }