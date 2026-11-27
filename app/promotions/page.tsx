import type { Metadata } from "next";
import { PromotionsPage } from "./promotions-page";

export const metadata: Metadata = {
  title: "Promotions | TIX ID",
  description: "Temukan promo tiket bioskop pilihan di TIX ID.",
};

export default function Page() {
  return <PromotionsPage />;
}
