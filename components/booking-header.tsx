import Link from "next/link";

const steps = ["Pilih Kursi", "Ringkasan", "Pembayaran"];

export function BookingHeader({ currentStep }: { currentStep: number }) {
  return (
    <>
      <header className="site-header">
        <Link href="/seat-selection" className="brand" aria-label="tix.id beranda">
          tix.id<span className="brand-mark" />
        </Link>
        <div className="header-note">
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" aria-hidden="true">
            <path
              d="M8 1.5 2.5 3.7v4.4c0 3.3 2.3 6.1 5.5 7.4 3.2-1.3 5.5-4.1 5.5-7.4V3.7L8 1.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="m5.5 8 1.7 1.7L10.7 6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Transaksi aman &amp; nyaman
        </div>
      </header>
      <nav className="steps" aria-label="Tahapan pemesanan">
        {steps.map((step, index) => {
          const number = index + 1;
          const state = number === currentStep ? "active" : number < currentStep ? "done" : "";
          return (
            <div className="step-group" key={step} style={{ display: "contents" }}>
              {index > 0 && <span className="step-line" aria-hidden="true" />}
              <div className={`step-item ${state}`} aria-current={number === currentStep ? "step" : undefined}>
                <span className="step-number">{number < currentStep ? "✓" : number}</span>
                {step}
              </div>
            </div>
          );
        })}
      </nav>
    </>
  );
}

export function MovieArtwork() {
  return (
    <div className="movie-banner" aria-label="Ilustrasi film Senja Terakhir" role="img">
      <div>
        <div className="movie-title">Senja Terakhir</div>
        <div className="movie-meta">Drama · 120 menit · SU</div>
      </div>
    </div>
  );
}

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatShowDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
