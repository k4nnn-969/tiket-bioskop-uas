import type { Metadata } from "next";
import { ComingSoonPage } from "./coming-soon-page";

export const metadata: Metadata = {
  title: "Coming Soon | TIX ID",
  description: "Lihat film-film yang segera tayang di bioskop.",
};

export default function Page() {
  return <ComingSoonPage />;
}
