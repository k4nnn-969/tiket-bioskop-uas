import type { Showtime } from "@/lib/booking-types";

const steps = ["Pilih Kursi", "Ringkasan", "Pembayaran"];
type HeaderShowtime = Pick<Showtime, "movieTitle" | "rating" | "cinema" | "studio" | "showDate" | "showTime">;

export function BookingHeader({ currentStep, showtime }: { currentStep: number; showtime: HeaderShowtime | null }) {
  return (
    <header className="booking-header">
      <div className="header-inner">
        <div className="brand-row">
          <div className="brand">CINEMA XXI<small>THE PREMIERE EXPERIENCE</small></div>
          <span className="mtix-badge">m.tix</span>
        </div>
        <div className="film-heading">
          <div>
            <h1>{showtime?.movieTitle ?? "Pemesanan Tiket"}</h1>
            <p>{showtime ? `${showtime.cinema} · ${showtime.studio}` : "Memuat jadwal bioskop…"}<br />
              {showtime ? `${formatShowDate(showtime.showDate)} · ${showtime.showTime} WIB` : "Pilih kursi untuk melanjutkan"}
            </p>
          </div>
          {showtime && <span className="rating-badge">{showtime.rating}</span>}
        </div>
      </div>
      <nav className="stepper" aria-label="Tahapan pemesanan">
        {steps.map((label, index) => {
          const number = index + 1;
          const done = number < currentStep;
          return (
            <div key={label} style={{ display: "contents" }}>
              {index > 0 && <span className="step-line" aria-hidden="true" />}
              <div className={`step ${number === currentStep ? "active" : ""} ${done ? "done" : ""}`} aria-current={number === currentStep ? "step" : undefined}>
                <span className="step-dot">{done ? "✓" : number}</span>{label}
              </div>
            </div>
          );
        })}
      </nav>
    </header>
  );
}

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

export function formatShowDate(value: string) {
  return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}
