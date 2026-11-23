import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "CINEMA XXI | Pemesanan Tiket",
  description: "Pilih kursi dan pesan tiket bioskop.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body className={`${cinzel.variable} ${jakarta.variable}`}>{children}</body>
    </html>
  );
}
