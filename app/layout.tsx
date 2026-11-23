import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tix.id — Pesan Tiket Bioskop",
  description: "Pilih kursi dan pesan tiket bioskop dengan mudah.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
