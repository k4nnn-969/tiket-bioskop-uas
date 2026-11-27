"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PaidBooking, Showtime } from "@/lib/booking-types";
import { formatRupiah, formatShowDate } from "@/components/booking-header";

const methods = [
  { value: "m-tix-balance", name: "m.tix Balance", description: "Bayar menggunakan saldo m.tix" },
  { value: "qris", name: "QRIS", description: "Scan dengan aplikasi pembayaran pilihanmu" },
  { value: "virtual-account", name: "Virtual Account", description: "Transfer melalui rekening virtual" },
];

export function PaymentSection({
  showtime, selectedSeats, paymentMethod, ticket, error, submitting, onChangeMethod, onPay, onBack, onStartOver,
}: {
  showtime: Showtime;
  selectedSeats: string[];
  paymentMethod: string;
  ticket: PaidBooking | null;
  error: string;
  submitting: boolean;
  onChangeMethod: (method: string) => void;
  onPay: () => void;
  onBack: () => void;
  onStartOver: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(300);
  useEffect(() => {
    if (ticket) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [ticket]);

  if (ticket) {
    return (
      <div className="ticket-success">
        <div className="success-mark">✓</div>
        <h2>Pembayaran Berhasil</h2>
        <p>Tiketmu tersimpan. Tunjukkan kode booking ini di bioskop.</p>
        <section className="surface ticket-card">
          <div className="ticket-top">
            <div className="ticket-film">CINEMA XXI · PASS KEY</div>
            <h3 className="ticket-title">{ticket.showtime.movieTitle}</h3>
            <div className="ticket-cinema">{ticket.showtime.cinema} · {ticket.showtime.studio}</div>
            <div className="passkey">{ticket.bookingCode}</div>
            <div className="passkey-caption">KODE BOOKING / PASS KEY</div>
          </div>
          <div className="ticket-perforation" />
          <div className="ticket-details">
            <div><span className="detail-label">TANGGAL</span><strong className="detail-value">{formatShowDate(ticket.showtime.showDate)}</strong></div>
            <div><span className="detail-label">JAM TAYANG</span><strong className="detail-value">{ticket.showtime.showTime} WIB</strong></div>
            <div><span className="detail-label">KURSI</span><strong className="detail-value seat-values">{ticket.seats.slice().sort().join(", ")}</strong></div>
            <div><span className="detail-label">PEMBAYARAN</span><strong className="detail-value">{methods.find((method) => method.value === ticket.paymentMethod)?.name ?? ticket.paymentMethod}</strong></div>
          </div>
          <div className="amount-list"><div className="amount-line total"><span>Total dibayar</span><strong>{formatRupiah(ticket.totalAmount)}</strong></div></div>
        </section>
        <div className="button-stack"><button type="button" className="primary-button" onClick={onStartOver}>SELESAI</button></div>
        <div className="button-stack"><Link className="secondary-button" href={`/eticket?ticket=${encodeURIComponent(ticket.id)}`}>LIHAT E-TICKET / CETAK</Link><Link className="secondary-button" href="/history">RIWAYAT PEMESANAN</Link></div>
        {error && <p className="notice" role="alert">{error}</p>}
        <p className="footer-note">Simpan kode booking ini. Pembayaran pada demo ini disimulasikan dan tidak memproses uang sungguhan.</p>
      </div>
    );
  }

  const total = selectedSeats.length * (showtime.ticketPrice + showtime.adminFee);
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  return (
    <>
      <p className="section-kicker">Langkah 3 dari 3</p>
      <h2 className="section-title">Pembayaran</h2>
      <p className="section-subtitle">Pilih metode pembayaran dan selesaikan transaksi.</p>
      <div className={`payment-timer ${secondsLeft === 0 ? "timer-expired" : ""}`}>
        <span>{secondsLeft ? "Selesaikan pembayaran sebelum" : "Waktu pembayaran telah habis"}</span>
        <strong>{minutes}:{seconds}</strong>
      </div>
      <section className="surface" style={{ padding: 15 }}>
        <div className="payment-list">
          {methods.map((method) => (
            <label key={method.value} className="payment-option">
              <input type="radio" name="payment-method" value={method.value} checked={paymentMethod === method.value} onChange={() => onChangeMethod(method.value)} />
              <span><strong>{method.name}</strong><small>{method.description}</small></span>
            </label>
          ))}
        </div>
        <div className="amount-line total" style={{ marginTop: 16 }}><span>Total pembayaran</span><strong>{formatRupiah(total)}</strong></div>
      </section>
      {error && <div className="notice" role="alert">{error}</div>}
      <div className="button-stack">
        <button type="button" className="primary-button" disabled={submitting || secondsLeft === 0} onClick={onPay}>
          {submitting ? "MEMPROSES PEMBAYARAN…" : `BAYAR SEKARANG · ${formatRupiah(total)}`}
        </button>
        <button type="button" className="secondary-button" onClick={onBack}>KEMBALI KE RINGKASAN</button>
      </div>
      <p className="footer-note">Pembayaran ini merupakan simulasi untuk keperluan demo. Tidak ada uang sungguhan yang diproses.</p>
    </>
  );
}
