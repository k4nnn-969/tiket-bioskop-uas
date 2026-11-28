'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import styles from './detail.module.css';

const moviesData = {
  'resident-evil': {
    title: 'Resident Evil',
    genre: 'Action · Horror · Sci-Fi',
    rating: '★ 8.7 / 10',
    duration: '1 Jam 40 Menit',
    age: 'R17+',
    release: '16 September 2026',
    releaseDateISO: '2026-09-16',
    director: 'Paul W. S. Anderson',
    cast: 'Milla Jovovich, Michelle Rodriguez',
    poster: '/img/Resident_Evil.webp',
    synopsis: 'Medical courier Bryan unwittingly finds himself fighting for survival as one fateful, horrifying night collapses around him in chaos.',
  },
  'forgotten-island': {
    title: 'Forgotten Island',
    genre: 'Comedy · Keluarga',
    rating: '★ 8.4 / 10',
    duration: '1 Jam 35 Menit',
    age: 'SU',
    release: '26 September 2026',
    releaseDateISO: '2026-09-26',
    director: 'Pierre Coffin',
    cast: 'Chris Pratt, Awkwafina, Jack Black',
    poster: '/img/Forgotten_Island.webp',
    synopsis: 'While celebrating their last night together, high school graduates and best friends Jo and Raissa stumble upon a mysterious portal that transports them to the fantastical island of Nakali.',
  },
  'fall-2-deadpoint': {
    title: 'Fall 2: Deadpoint',
    genre: 'Thriller · Petualangan',
    rating: '★ 8.2 / 10',
    duration: '1 Jam 48 Menit',
    age: 'R13+',
    release: '16 September 2026',
    releaseDateISO: '2026-09-16',
    director: 'Scott Mann',
    cast: 'Grace Caroline Currey, Virginia Gardner',
    poster: '/img/Fall_2.webp',
    synopsis: "On a perilous climb across Thailand's Mount Kwan, two climbers become trapped thousands of feet above the ground.",
  },
  digger: {
    title: 'Digger',
    genre: 'Comedy · Drama',
    rating: '★ 8.0 / 10',
    duration: '2 Jam 9 Menit',
    age: 'R13+',
    release: '02 Oktober 2026',
    releaseDateISO: '2026-10-02',
    director: 'Georgios Grigorakis',
    cast: 'Vangelis Mourikis, Argyris Pandazaras',
    poster: '/img/Digger.webp',
    synopsis: "The most powerful man in the world embarks on a frantic mission to prove he is humanity's savior before the disaster he's unleashed destroys everything.",
  },
  'the-last-frontier': {
    title: 'The Last Frontier',
    genre: 'Action · Petualangan',
    rating: '★ 9.2 / 10',
    duration: '2 Jam 18 Menit',
    age: 'R13+',
    release: '12 Oktober 2026',
    releaseDateISO: '2026-10-12',
    director: 'Alexander Vance',
    cast: 'Marcus Cole, Elena Rostova, David Kim',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85',
    synopsis: 'Misi penyelamatan berisiko tinggi di garis batas terakhir peradaban.',
  },
  'after-the-rain': {
    title: 'After the Rain',
    genre: 'Drama · Romance',
    rating: '★ 8.8 / 10',
    duration: '1 Jam 52 Menit',
    age: 'SU',
    release: '18 Oktober 2026',
    releaseDateISO: '2026-10-18',
    director: 'Sofia Coppola',
    cast: 'Clara Oswald, Julian Vance',
    poster: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=85',
    synopsis: 'Kisah perjalanan emosional dua sahabat yang kembali bertemu setelah bertahun-tahun terpisah.',
  },
  'little-big-adventure': {
    title: 'Little Big Adventure',
    genre: 'Keluarga · Petualangan',
    rating: '★ 9.0 / 10',
    duration: '1 Jam 38 Menit',
    age: 'SU',
    release: '24 Oktober 2026',
    releaseDateISO: '2026-10-24',
    director: 'Pete Docter',
    cast: 'Leo Howard, Maya Lin',
    poster: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=700&q=85',
    synopsis: 'Petualangan ajaib seorang anak dan kawan-kawan kecilnya menjelajahi hutan terlarang.',
  },
  'midnight-signal': {
    title: 'Midnight Signal',
    genre: 'Action · Thriller',
    rating: '★ 8.5 / 10',
    duration: '2 Jam 05 Menit',
    age: 'R17+',
    release: '31 Oktober 2026',
    releaseDateISO: '2026-10-31',
    director: 'Denis Villeneuve',
    cast: 'Ethan Hawke, Zoe Saldana',
    poster: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85',
    synopsis: 'Sinyal misterius yang diterima stasiun radio tua pada tengah malam memicu serangkaian teror.',
  },
};

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const movie =
    moviesData[id as keyof typeof moviesData] || moviesData['the-last-frontier'];

  const [reminderSet, setReminderSet] = useState(false);
  const [city, setCity] = useState('Jakarta');
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [toast, setToast] = useState('');

  const showToast = (pesan: string) => {
    setToast(pesan);
    setTimeout(() => setToast(''), 3000);
  };

  const today = new Date('2026-10-03');
  const releaseDate = new Date(movie.releaseDateISO);
  const isNowShowing = today >= releaseDate;

  const handleReminder = () => {
    const next = !reminderSet;
    setReminderSet(next);
    showToast(next ? `Pengingat ${movie.title} diaktifkan.` : 'Pengingat dinonaktifkan.');
  };

  const handleCity = () => {
    const nextCity = city === 'Jakarta' ? 'Bandung' : 'Jakarta';
    setCity(nextCity);
    showToast(`Lokasi diubah ke ${nextCity}`);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthOpen(false);
    showToast(authTab === 'login' ? 'Berhasil login!' : 'Pendaftaran berhasil!');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topline}></div>

      <header className={styles.header}>
        <div className={styles.nav}>
          <Link className={styles.brand} href="/">
            <span className={styles.brandTix}>TIX</span>
            <span className={styles.brandId}>ID</span>
            <span className={styles.brandDot}></span>
          </Link>
          <nav className={styles.links}>
            <Link href="/#promo">Promotions</Link>
            <Link href="/movies">Coming Soon</Link>
            <Link href="/#fitur">Fitur Pendukung</Link>
          </nav>
          <div className={styles.navActions}>
            <button className={styles.location} type="button" onClick={handleCity}>
              <span>{city}</span>
            </button>
            <button className={styles.login} type="button" onClick={() => setAuthOpen(true)}>
              Login / Register
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.detailHero}>
          <div className={styles.detailContainer}>
            <div className={styles.detailPoster}>
              <img src={movie.poster} alt={movie.title} />
            </div>

            <div>
              <span className={`${styles.eyebrow} ${isNowShowing ? styles.eyebrowNow : ''}`}>
                {isNowShowing ? 'Sedang Tayang' : 'Segera Tayang'}
              </span>
              <h1 className={styles.detailTitle}>{movie.title}</h1>

              <div className={styles.detailTags}>
                <span className={`${styles.detailTag} ${styles.detailTagRating}`}>
                  {movie.rating}
                </span>
                <span className={styles.detailTag}>{movie.genre}</span>
                <span className={styles.detailTag}>{movie.duration}</span>
                <span className={styles.detailTag}>{movie.age}</span>
              </div>

              <p className={styles.detailSynopsisPreview}>{movie.synopsis}</p>

              <div className={styles.detailActions}>
                {isNowShowing ? (
                  <button
                    className={styles.buyBtn}
                    type="button"
                    onClick={() => router.push(`/booking/${id}`)}
                  >
                    🎟 &nbsp; Beli Tiket
                  </button>
                ) : (
                  <button
                    className={`${styles.remindBtn} ${reminderSet ? styles.remindBtnSet : ''}`}
                    type="button"
                    onClick={handleReminder}
                  >
                    {reminderSet ? '✓ Pengingat aktif' : '♧ \u00A0 Ingatkan Saya'}
                  </button>
                )}

                <Link className={styles.ghostBtn} href="/movies">
                  ← Kembali ke Katalog
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.contentWrapper}>
          <div>
            <section className={styles.synopsisCard}>
              <h2 className={styles.cardTitle}>Sinopsis Lengkap</h2>
              <p className={styles.fullSynopsis}>{movie.synopsis}</p>
            </section>

            <section className={styles.trailerCard}>
              <h2 className={styles.cardTitle}>Official Trailer</h2>
              <div
                className={styles.videoPlaceholder}
                onClick={() => showToast('Memutar trailer film...')}
              >
                <img src={movie.poster} alt="Trailer Thumbnail" />
                <div className={styles.playIcon}>▶</div>
                <span className={styles.trailerLabel}>Putar Official Trailer</span>
              </div>
            </section>
          </div>

          <div>
            <div className={styles.infoSidebar}>
              <h3 className={`${styles.cardTitle} ${styles.sidebarTitle}`}>Informasi Film</h3>

              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>Tanggal Rilis</div>
                <div className={styles.infoValue}>{movie.release}</div>
              </div>
              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>Sutradara</div>
                <div className={styles.infoValue}>{movie.director}</div>
              </div>
              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>Pemeran Utama</div>
                <div className={styles.infoValue}>{movie.cast}</div>
              </div>
              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>Bahasa / Subtitle</div>
                <div className={styles.infoValue}>Inggris (Subtitle Indonesia)</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <Link className={`${styles.brand} ${styles.footerBrand}`} href="/">
              <span className={styles.brandTix}>TIX</span>
              <span className={styles.brandId}>ID</span>
              <span className={styles.brandDot}></span>
            </Link>
            <p className={styles.footerCaption}>Cari film. Pesan tiket. Nikmati ceritanya.</p>
          </div>
          <nav className={styles.footerLinks}>
            <Link href="/#promo">Promotions</Link>
            <Link href="/movies">Coming Soon</Link>
          </nav>
        </div>
      </footer>

      {authOpen && (
        <div className={styles.backdrop} onClick={() => setAuthOpen(false)}>
          <section className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} type="button" onClick={() => setAuthOpen(false)}>
              ✕
            </button>

            <h2 className={styles.modalTitle}>Selamat datang!</h2>
            <p className={styles.subtitle}>
              Masuk atau buat akun untuk pengalaman nonton yang lebih personal.
            </p>

            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${authTab === 'login' ? styles.tabActive : ''}`}
                type="button"
                onClick={() => setAuthTab('login')}
              >
                Login
              </button>
              <button
                className={`${styles.tab} ${authTab === 'register' ? styles.tabActive : ''}`}
                type="button"
                onClick={() => setAuthTab('register')}
              >
                Daftar
              </button>
            </div>

            <form className={styles.authForm} onSubmit={handleAuthSubmit}>
              <label className={styles.authField}>
                Email atau nomor ponsel
                <input type="text" placeholder="nama@email.com" required />
              </label>

              {authTab === 'register' && (
                <label className={styles.authField}>
                  Nama lengkap
                  <input type="text" placeholder="Nama kamu" required />
                </label>
              )}

              <label className={styles.authField}>
                Kata sandi
                <input type="password" placeholder="Masukkan kata sandi" minLength={6} required />
              </label>

              <button className={styles.authSubmit} type="submit">
                {authTab === 'login' ? 'Login' : 'Daftar'}
              </button>
            </form>
          </section>
        </div>
      )}

      {toast && (
        <div className={`${styles.toast} ${styles.toastVisible}`}>
          {toast}
        </div>
      )}
    </div>
  );
}