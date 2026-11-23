"use client";

import type { Showtime } from "@/lib/booking-types";
import { formatRupiah, formatShowDate } from "@/components/booking-header";

export function OrderSummary({
  showtime, selectedSeats, error, onBack, onContinue,
}: {
  showtime: Showtime;
  selectedSeats: string[];
  error: string;
  onBack: () => void;
  onContinue: () => void;
}) {
  const subtotal = selectedSeats.length * showtime.ticketPrice;
  const fee = selectedSeats.length * showtime.adminFee;
  return (
    <>
      <p className="section-kicker">Langkah 2 dari 3</p>
      <h2 className="section-title">Ringkasan pesanan</h2>
      <p className="section-subtitle">Periksa kembali detail tiket sebelum melanjutkan ke pembayaran.</p>
      <section className="surface ticket-card" aria-label="Ringkasan tiket">
        <div className="ticket-top">
          <div className="ticket-film">CINEMA XXI · E-TICKET PREVIEW</div>
          <h3 className="ticket-title">{showtime.movieTitle}</h3>
          <div className="ticket-cinema">{showtime.cinema} · {showtime.studio}</div>
        </div>
        <div className="ticket-perforation" />
        <div className="ticket-details">
          <div><span className="detail-label">TANGGAL</span><strong className="detail-value">{formatShowDate(showtime.showDate)}</strong></div>
          <div><span className="detail-label">JAM TAYANG</span><strong className="detail-value">{showtime.showTime} WIB</strong></div>
          <div><span className="detail-label">STUDIO</span><strong className="detail-value">{showtime.studio}</strong></div>
          <div><span className="detail-label">NOMOR KURSI</span><strong className="detail-value seat-values">{selectedSeats.slice().sort().join(", ")}</strong></div>
        </div>
        <div className="amount-list">
          <div className="amount-line"><span>Subtotal tiket ({selectedSeats.length} × {formatRupiah(showtime.ticketPrice)})</span><strong>{formatRupiah(subtotal)}</strong></div>
          <div className="amount-line"><span>Biaya admin m.tix ({selectedSeats.length} × {formatRupiah(showtime.adminFee)})</span><strong>{formatRupiah(fee)}</strong></div>
          <div className="amount-line total"><span>Total bayar</span><strong>{formatRupiah(subtotal + fee)}</strong></div>
        </div>
      </section>
      {error && <div className="notice" role="alert">{error}</div>}
      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onBack}>UBAH KURSI</button>
        <button type="button" className="primary-button" onClick={onContinue}>LANJUT PEMBAYARAN</button>
      </div>
    </>
  );
}
