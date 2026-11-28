'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const nowShowingMovies = [
  {
    id: 'resident-evil',
    title: 'Resident Evil',
    genre: 'Horror · Petualangan',
    poster: '/img/Resident_Evil.webp',
  },
  {
    id: 'forgotten-island',
    title: 'Forgotten Island',
    genre: 'Comedy · Keluarga',
    poster: '/img/Forgotten_Island.webp',
  },
  {
    id: 'fall-2-deadpoint',
    title: 'Fall 2: Deadpoint',
    genre: 'Thriller · Petualangan',
    poster: '/img/Fall_2.webp',
  },
  {
    id: 'digger',
    title: 'Digger',
    genre: 'Comedy · Drama',
    poster: '/img/Digger.webp',
  },
];

const comingSoonMovies = [
  {
    id: 'the-last-frontier',
    title: 'The Last Frontier',
    genre: 'Action · Petualangan',
    date: 'Mulai tayang 12 Oktober 2026',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'after-the-rain',
    title: 'After the Rain',
    genre: 'Drama · Romance',
    date: 'Mulai tayang 18 Oktober 2026',
    poster: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'little-big-adventure',
    title: 'Little Big Adventure',
    genre: 'Keluarga · Petualangan',
    date: 'Mulai tayang 24 Oktober 2026',
    poster: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'midnight-signal',
    title: 'Midnight Signal',
    genre: 'Action · Thriller',
    date: 'Mulai tayang 31 Oktober 2026',
    poster: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85',
  },
];

export default function HomePage() {
  const router = useRouter();

  const [city, setCity] = useState('Jakarta');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [reminders, setReminders] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [toast, setToast] = useState('');

  const showToast = (pesan: string) => {
    setToast(pesan);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery.trim().toLowerCase());
    const section = document.getElementById('sedang-tayang');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleReminder = (title: string) => {
    if (reminders.includes(title)) {
      setReminders(reminders.filter((item) => item !== title));
      showToast(`Pengingat ${title} dinonaktifkan.`);
    } else {
      setReminders([...reminders, title]);
      showToast(`Pengingat ${title} diaktifkan.`);
    }
  };

  const handleCopyPromo = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Kode promo ${code} berhasil disalin!`);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthOpen(false);
    showToast(authTab === 'login' ? 'Berhasil login!' : 'Pendaftaran berhasil!');
  };

  const filteredNowShowing = nowShowingMovies.filter((movie) =>
    movie.title.toLowerCase().includes(activeSearch)
  );

  const filteredComingSoon = comingSoonMovies.filter((movie) =>
    movie.title.toLowerCase().includes(activeSearch)
  );

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topline}></div>

      <header className={styles.header}>
        <div className={styles.nav}>
          <a className={styles.brand} href="#beranda" aria-label="TIX ID Beranda">
            <span className={styles.brandTix}>TIX</span>
            <span className={styles.brandId}>ID</span>
            <span className={styles.brandDot}></span>
          </a>

          <nav className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
            <a href="#sedang-tayang">Now Showing</a>
            <a href="#segera-tayang">Coming Soon</a>
            <a href="#promo">Promotions</a>
            <Link href="/cinemas">Cinema</Link>
          </nav>

          <div className={styles.navActions}>
            <button
              className={styles.location}
              type="button"
              onClick={() => {
                const next = city === 'Jakarta' ? 'Bandung' : 'Jakarta';
                setCity(next);
                showToast(`Kota diubah ke ${next}`);
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span>{city}</span>
            </button>
            <button className={styles.login} type="button" onClick={() => setAuthOpen(true)}>
              Login / Register
            </button>
          </div>

          <button
            className={styles.menu}
            type="button"
            aria-label="Buka menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className={styles.hero} id="beranda">
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>Cerita seru dimulai di sini</span>
            <h1 className={styles.heroTitle}>
              Film bagus.<br />
              <span>Kursi terbaik.</span>
            </h1>
            <p className={styles.heroCopy}>
              Temukan film favoritmu, cek jadwal bioskop, dan siapkan popcorn. Semua tiket ada dalam satu tempat.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primary} href="#segera-tayang">
                Jelajahi Film{' '}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </a>
              <a className={styles.ghost} href="#promo">
                Lihat Promo
              </a>
            </div>
            <div className={styles.heroNote}>
              <span className={styles.liveDot}></span> Pengalaman nonton lebih praktis, langsung dari genggaman.
            </div>
          </div>
        </section>

        {/* SEARCH SECTION */}
        <div className={styles.searchShell} id="cari-film">
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.field}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <div className={styles.fieldCopy}>
                <label htmlFor="city-select">KOTA</label>
                <select
                  id="city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option>Jakarta</option>
                  <option>Bandung</option>
                  <option>Surabaya</option>
                  <option>Yogyakarta</option>
                  <option>Semarang</option>
                  <option>Medan</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <div className={styles.fieldCopy}>
                <label htmlFor="movie-search">CARI FILM</label>
                <input
                  id="movie-search"
                  type="search"
                  placeholder="Judul film yang dicari"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value === '') setActiveSearch('');
                  }}
                />
              </div>
            </div>

            <button className={styles.searchSubmit} type="submit">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>{' '}
              Cari Film
            </button>
          </form>
        </div>

        {/* SECTION SEDANG TAYANG */}
        <section className={`${styles.section} ${styles.movieSection}`} id="sedang-tayang">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>Pilih dan Nonton Sekarang</p>
              <h2 className={styles.sectionTitle}>Sedang Tayang</h2>
            </div>
            <Link href="/movies" className={styles.btnSeeAll}>
              Lihat Semua →
            </Link>
          </div>

          <div className={styles.movieGrid}>
            {filteredNowShowing.length > 0 ? (
              filteredNowShowing.map((movie) => (
                <div key={movie.id} className={styles.movieCard}>
                  <Link href={`/movies/${movie.id}`} className={styles.cardLink}>
                    <div className={styles.poster}>
                      <img src={movie.poster} alt={movie.title} loading="lazy" />
                    </div>
                    <div className={styles.movieInfo}>
                      <p className={styles.genre}>{movie.genre}</p>
                      <h3 className={styles.movieTitle}>{movie.title}</h3>
                      <p className={styles.date}>Sedang tayang di bioskop</p>
                    </div>
                  </Link>
                  <div className={styles.cardActionWrap}>
                    <button
                      className={styles.buy}
                      type="button"
                      onClick={() => router.push(`/booking/${movie.id}`)}
                    >
                      🎟 &nbsp; Beli Tiket
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.empty}>Film tidak ditemukan. Coba kata kunci lain.</p>
            )}
          </div>
        </section>

        {/* SECTION SEGERA TAYANG */}
        <section className={`${styles.section} ${styles.movieSection}`} id="segera-tayang">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>Catat tanggalnya</p>
              <h2 className={styles.sectionTitle}>Segera tayang</h2>
            </div>
            <Link href="/movies" className={styles.btnSeeAll}>
              Lihat Semua →
            </Link>
          </div>

          <div className={styles.movieGrid}>
            {filteredComingSoon.length > 0 ? (
              filteredComingSoon.map((movie) => {
                const isSet = reminders.includes(movie.title);
                return (
                  <article key={movie.id} className={styles.movieCard}>
                    <Link href={`/movies/${movie.id}`} className={styles.cardLink}>
                      <div className={styles.poster}>
                        <img src={movie.poster} alt={movie.title} loading="lazy" />
                        <span className={styles.release}>Segera tayang</span>
                      </div>
                      <div className={styles.movieInfo}>
                        <p className={styles.genre}>{movie.genre}</p>
                        <h3 className={styles.movieTitle}>{movie.title}</h3>
                        <p className={styles.date}>{movie.date}</p>
                      </div>
                    </Link>
                    <div className={styles.cardActionWrap}>
                      <button
                        className={`${styles.remind} ${isSet ? styles.remindSet : ''}`}
                        type="button"
                        onClick={() => toggleReminder(movie.title)}
                      >
                        {isSet ? '✓ Pengingat aktif' : '♧ \u00A0 Ingatkan saya'}
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className={styles.empty}>Film tidak ditemukan. Coba kata kunci lain.</p>
            )}
          </div>
        </section>

        {/* PROMO SECTION */}
        <section className={styles.section} id="promo">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>Lebih hemat, lebih seru</p>
              <h2 className={styles.sectionTitle}>Promo pilihan minggu ini</h2>
              <p className={styles.description}>
                Nonton film favorit dengan penawaran spesial dari TIX ID.
              </p>
            </div>
            <a className={styles.textLink} href="#promo-list">
              Semua promo <span>→</span>
            </a>
          </div>

          <div className={styles.promoGrid} id="promo-list">
            <article
              className={styles.promoCard}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1000&q=80')",
              }}
            >
              <span className={styles.promoTag}>Pilihan hari ini</span>
              <div>
                <h3>Waktunya movie date</h3>
                <p>Hemat tiket untuk cerita yang ingin kamu bagi.</p>
                <button
                  className={styles.promoCode}
                  type="button"
                  onClick={() => handleCopyPromo('MOVIEDATE')}
                >
                  KODE: MOVIEDATE <span>⧉</span>
                </button>
              </div>
            </article>

            <article
              className={styles.promoCard}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80')",
              }}
            >
              <span className={styles.promoTag}>Akhir pekan</span>
              <div>
                <h3>Weekend, layar lebar</h3>
                <p>Mulai akhir pekanmu dengan film pilihan.</p>
                <button
                  className={styles.promoCode}
                  type="button"
                  onClick={() => handleCopyPromo('WEEKEND')}
                >
                  KODE: WEEKEND <span>⧉</span>
                </button>
              </div>
            </article>

            <article
              className={styles.promoCard}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80')",
              }}
            >
              <span className={styles.promoTag}>Teman nonton</span>
              <div>
                <h3>Serunya rame-rame</h3>
                <p>Ajak teman dan temukan film untuk semua.</p>
                <button
                  className={styles.promoCode}
                  type="button"
                  onClick={() => handleCopyPromo('NONTONBARENG')}
                >
                  KODE: NONTONBARENG <span>⧉</span>
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* SUPPORT SECTION */}
        <section className={styles.support} id="fitur">
          <div className={styles.supportInner}>
            <div className={styles.supportHeading}>
              <div>
                <p className={styles.kicker}>Kemudahan Nonton</p>
                <h2>Semua kebutuhan nonton, lebih mudah.</h2>
              </div>
              <p>
                Mulai dari cari bioskop sampai tiket digital, pengalaman nontonmu jadi praktis dari awal sampai selesai.
              </p>
            </div>

            <div className={styles.supportGrid}>
              <article className={styles.supportItem}>
                <span className={styles.supportIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                    <path d="M8 9h2m-2 4h2m-2 4h2m5-2h2m-2 3h2" />
                  </svg>
                </span>
                <div>
                  <h3>Cari bioskop</h3>
                  <p>Temukan lokasi dan jadwal di kotamu.</p>
                </div>
              </article>

              <article className={styles.supportItem}>
                <span className={styles.supportIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18m-13 4h3m-3 3h6" />
                  </svg>
                </span>
                <div>
                  <h3>Pilih jadwal</h3>
                  <p>Atur waktu nonton sesuai rencanamu.</p>
                </div>
              </article>

              <article className={styles.supportItem}>
                <span className={styles.supportIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 10h18m-14 5h4" />
                  </svg>
                </span>
                <div>
                  <h3>Pembayaran praktis</h3>
                  <p>Pilihan pembayaran dalam satu alur.</p>
                </div>
              </article>

              <article className={styles.supportItem}>
                <span className={styles.supportIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 5h16v14H4zM8 9h8m-8 3h8m-8 3h5" />
                    <path d="m7 2 2 3m8-3-2 3" />
                  </svg>
                </span>
                <div>
                  <h3>Tiket digital</h3>
                  <p>Akses tiketmu dengan mudah di ponsel.</p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <a className={`${styles.brand} ${styles.footerBrand}`} href="#beranda">
              <span className={styles.brandTix}>TIX</span>
              <span className={styles.brandId}>ID</span>
              <span className={styles.brandDot}></span>
            </a>
            <p className={styles.footerCaption}>Cari film. Pesan tiket. Nikmati ceritanya.</p>
          </div>
          <nav className={styles.footerLinks}>
            <a href="#promo">Promotions</a>
            <a href="#segera-tayang">Coming Soon</a>
            <a href="#fitur">Bantuan</a>
            <a href="#beranda">Kembali ke atas ↑</a>
          </nav>
        </div>
      </footer>

      {/* MODAL AUTH */}
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

            <p className={styles.legal}>
              Dengan melanjutkan, kamu menyetujui Syarat &amp; Ketentuan serta Kebijakan Privasi TIX ID.
            </p>
          </section>
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}