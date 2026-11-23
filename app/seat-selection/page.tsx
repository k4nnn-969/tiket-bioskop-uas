"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingHeader, formatRupiah, MovieArtwork } from "@/components/booking-header";

const dates = [
  { value: "2026-11-12", label: "Kam, 12 Nov" },
  { value: "2026-11-13", label: "Jum, 13 Nov" },
];
const times = ["13:15", "16:30", "19:45"];
const seatRows = ["A", "B", "C", "D", "E", "F", "G"];
const seatPrice = 50_000;
const unavailableSeats = new Set(["A3", "C5", "F7"]);
const initialShowtime = `${dates[0].value}|${times[1]}`;

export default function SeatSelectionPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [selectedTime, setSelectedTime] = useState(times[1]);
  const [selection, setSelection] = useState({ showtimeKey: initialShowtime, seats: [] as string[] });
  const [seatSnapshot, setSeatSnapshot] = useState<{ showtimeKey: string; seats: string[] } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const showtimeKey = `${selectedDate}|${selectedTime}`;
  const selectedSeats = selection.showtimeKey === showtimeKey ? selection.seats : [];
  const reservedSeats = seatSnapshot?.showtimeKey === showtimeKey ? seatSnapshot.seats : [];
  const loadingSeats = seatSnapshot?.showtimeKey !== showtimeKey;
  useEffect(() => {
    let active = true;
    fetch(`/api/seats?showtime=${encodeURIComponent(showtimeKey)}`)
      .then(async (response) => {
        const result = (await response.json()) as { seats?: string[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Kursi tidak dapat dimuat.");
        if (active) setSeatSnapshot({ showtimeKey, seats: result.seats ?? [] });
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Kursi tidak dapat dimuat.");
          setSeatSnapshot({ showtimeKey, seats: [] });
        }
      });

    return () => {
      active = false;
    };
  }, [showtimeKey]);

  const ticketCount = selectedSeats.length;
  const total = ticketCount * (seatPrice + 5_000);

  function toggleSeat(seat: string) {
    setError("");
    setSelection((currentSelection) => {
      const current = currentSelection.showtimeKey === showtimeKey ? currentSelection.seats : [];
      return {
        showtimeKey,
        seats: current.includes(seat) ? current.filter((value) => value !== seat) : [...current, seat],
      };
    });
  }

  async function createOrder() {
    if (!ticketCount || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showDate: selectedDate, showTime: selectedTime, seats: selectedSeats }),
      });
      const result = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !result.id) throw new Error(result.error ?? "Pesanan tidak dapat dibuat.");
      router.push(`/order-summary?id=${encodeURIComponent(result.id)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Pesanan tidak dapat dibuat.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <BookingHeader currentStep={1} />
      <main className="page-shell">
        <div className="page-heading">
          <div className="eyebrow">Senja Terakhir · Studio 3</div>
          <h1>Pilih kursi favoritmu</h1>
          <p>Temukan tempat terbaik untuk menikmati film.</p>
        </div>

        <div className="booking-layout">
          <section className="surface seat-panel" aria-label="Pilih jadwal dan kursi">
            <div className="panel-heading">
              <div>
                <h2>Jadwal &amp; kursi</h2>
                <p>Studio reguler · pilih hingga 6 kursi</p>
              </div>
              <div className="showtime-select" aria-label="Tanggal film">
                {dates.map((date) => (
                  <button
                    className={`showtime-button ${selectedDate === date.value ? "selected" : ""}`}
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    type="button"
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="showtime-select" aria-label="Jam tayang" style={{ marginTop: 16 }}>
              {times.map((time) => (
                <button
                  className={`showtime-button ${selectedTime === time ? "selected" : ""}`}
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  type="button"
                >
                  {time}
                </button>
              ))}
            </div>

            <div className="screen-wrap">
              <div className="screen-arc" />
              <div className="screen-label">LAYAR BIOSKOP</div>
            </div>
            <div className="seat-grid" aria-label="Denah kursi bioskop">
              {seatRows.map((row) => (
                <div className="seat-row" key={row}>
                  <span className="row-label">{row}</span>
                  {Array.from({ length: 8 }, (_, index) => {
                    const seat = `${row}${index + 1}`;
                    const occupied = unavailableSeats.has(seat) || reservedSeats.includes(seat);
                    return (
                      <span key={seat} style={{ display: "contents" }}>
                        {index === 4 && <span className="aisle" aria-hidden="true" />}
                        <button
                          aria-label={`Kursi ${seat}${occupied ? ", tidak tersedia" : ""}`}
                          aria-pressed={selectedSeats.includes(seat)}
                          className={`seat ${occupied ? "occupied" : ""} ${selectedSeats.includes(seat) ? "selected" : ""}`}
                          disabled={occupied || loadingSeats || (selectedSeats.length >= 6 && !selectedSeats.includes(seat))}
                          onClick={() => toggleSeat(seat)}
                          type="button"
                        />
                      </span>
                    );
                  })}
                  <span className="row-label">{row}</span>
                </div>
              ))}
            </div>
            <div className="seat-legend" aria-label="Legenda kursi">
              <div className="legend-item"><span className="legend-swatch" /> Tersedia</div>
              <div className="legend-item"><span className="legend-swatch selected" /> Pilihanmu</div>
              <div className="legend-item"><span className="legend-swatch occupied" /> Terisi</div>
            </div>
          </section>

          <aside className="surface order-card" aria-label="Ringkasan pilihan tiket">
            <MovieArtwork />
            <h2 className="summary-title">Detail pemesanan</h2>
            <div className="summary-line"><span>Lokasi</span><strong>Studio 3 · Jakarta</strong></div>
            <div className="summary-line"><span>Tanggal</span><strong>{dates.find((date) => date.value === selectedDate)?.label}</strong></div>
            <div className="summary-line"><span>Jam tayang</span><strong>{selectedTime} WIB</strong></div>
            <div className="summary-line"><span>Kursi</span><strong>{selectedSeats.length ? [...selectedSeats].sort().join(", ") : "Belum dipilih"}</strong></div>
            <hr className="divider" />
            <div className="summary-line"><span>{ticketCount} tiket × {formatRupiah(seatPrice)}</span><strong>{formatRupiah(ticketCount * seatPrice)}</strong></div>
            <div className="summary-line"><span>Biaya layanan</span><strong>{formatRupiah(ticketCount * 5_000)}</strong></div>
            <div className="summary-line summary-total"><span>Total</span><strong>{formatRupiah(total)}</strong></div>
            <div className="selection-hint">{loadingSeats ? "Memuat ketersediaan kursi…" : `Maksimal 6 kursi · ${ticketCount} dipilih`}</div>
            {error && <div className="notice" role="alert">{error}</div>}
            <button className="primary-button" disabled={!ticketCount || loadingSeats || submitting} onClick={createOrder} type="button">
              {submitting ? "Menyimpan pesanan…" : "Lanjutkan"}
            </button>
          </aside>
        </div>
      </main>
    </>
  );
}
