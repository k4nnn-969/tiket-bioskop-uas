"use client";

import type { Showtime } from "@/lib/booking-types";
import { formatRupiah } from "@/components/booking-header";

const rows = ["F", "E", "D", "C", "B", "A"];

export function SeatSelection({
  showtime, selectedSeats, error, onToggleSeat, onContinue, loading,
}: {
  showtime: Showtime;
  selectedSeats: string[];
  error: string;
  onToggleSeat: (seat: string) => void;
  onContinue: () => void;
  loading: boolean;
}) {
  const total = selectedSeats.length * showtime.ticketPrice;
  return (
    <>
      <p className="section-kicker">Langkah 1 dari 3</p>
      <h2 className="section-title">Pilih kursi</h2>
      <p className="section-subtitle">Pilih hingga 6 kursi untuk pengalaman menonton terbaik.</p>
      <section className="surface seat-card" aria-label="Denah kursi bioskop">
        <div className="seat-card-header">
          <div><strong>{showtime.studio}</strong><span>{showtime.cinema}</span></div>
          <span className="seat-price">{formatRupiah(showtime.ticketPrice)} / kursi</span>
        </div>
        {loading ? <div className="seat-skeleton" aria-label="Memuat kursi" /> : (
          <>
            <div className="seat-map">
              {rows.map((row) => (
                <div className="seat-row" key={row}>
                  <span className="row-letter">{row}</span>
                  {Array.from({ length: 8 }, (_, index) => {
                    const seat = `${row}${index + 1}`;
                    const occupied = showtime.occupiedSeats.includes(seat);
                    const selected = selectedSeats.includes(seat);
                    return (
                      <span key={seat} style={{ display: "contents" }}>
                        {index === 4 && <span className="aisle" aria-hidden="true" />}
                        <button
                          type="button"
                          className={`seat ${occupied ? "occupied" : ""} ${selected ? "selected" : ""}`}
                          aria-label={`Kursi ${seat}${occupied ? ", terisi" : selected ? ", dipilih" : ", tersedia"}`}
                          aria-pressed={selected}
                          disabled={occupied || (!selected && selectedSeats.length >= 6)}
                          onClick={() => onToggleSeat(seat)}
                        />
                      </span>
                    );
                  })}
                  <span className="row-letter">{row}</span>
                </div>
              ))}
            </div>
            <div className="screen-under-map">LAYAR BIOSKOP</div>
          </>
        )}
        <div className="legend" aria-label="Legenda kursi">
          <span className="legend-item"><i className="legend-swatch" />Tersedia</span>
          <span className="legend-item"><i className="legend-swatch selected" />Pilihanmu</span>
          <span className="legend-item"><i className="legend-swatch occupied" />Terisi</span>
        </div>
      </section>
      {error && <div className="notice" role="alert">{error}</div>}
      <div className="bottom-bar">
        <div className="bottom-inner">
          <div className="bottom-info">
            <span>{selectedSeats.length ? `KURSI ${selectedSeats.slice().sort().join(", ")}` : "PILIH KURSI"}</span>
            <strong>{formatRupiah(total)}</strong>
          </div>
          <button type="button" className="primary-button" disabled={!selectedSeats.length || loading} onClick={onContinue}>RINGKASAN ORDER</button>
        </div>
      </div>
      <p className="footer-note">Maksimal 6 kursi per transaksi. Kursi yang telah terisi tidak dapat dipilih.</p>
    </>
  );
}
