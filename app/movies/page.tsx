'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './movies.module.css';

const moviesData = [
  {
    id: 'resident-evil',
    title: 'Resident Evil',
    release: '16 September 2026',
    releaseDateISO: '2026-09-16',
    poster: '/img/Resident_Evil.webp',
  },
  {
    id: 'digger',
    title: 'Digger',
    release: '02 Oktober 2026',
    releaseDateISO: '2026-10-02',
    poster: '/img/Digger.webp',
  },
  {
    id: 'the-last-frontier',
    title: 'The Last Frontier',
    release: '12 Oktober 2026',
    releaseDateISO: '2026-10-12',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'after-the-rain',
    title: 'After the Rain',
    release: '18 Oktober 2026',
    releaseDateISO: '2026-10-18',
    poster: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'forgotten-island',
    title: 'Forgotten Island',
    release: '26 September 2026',
    releaseDateISO: '2026-09-26',
    poster: '/img/Forgotten_Island.webp',
  },
  {
    id: 'fall-2-deadpoint',
    title: 'Fall 2: Deadpoint',
    release: '16 September 2026',
    releaseDateISO: '2026-09-16',
    poster: '/img/Fall_2.webp',
  },
  {
    id: 'little-big-adventure',
    title: 'Little Big Adventure',
    release: '24 November 2026',
    releaseDateISO: '2026-11-24',
    poster: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'midnight-signal',
    title: 'Midnight Signal',
    release: '31 Desember 2026',
    releaseDateISO: '2026-12-31',
    poster: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85',
  },
];

export default function MoviesPage() {
  const [currentTab, setCurrentTab] = useState('now-showing');

  const today = new Date('2026-10-03');

  const filteredMovies = moviesData.filter((movie) => {
    const releaseDate = new Date(movie.releaseDateISO);
    const isNowShowing = today >= releaseDate;
    return currentTab === 'now-showing' ? isNowShowing : !isNowShowing;
  });

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <div className={styles.nav}>
          <Link className={styles.brand} href="/">
            <span className={styles.brandTix}>TIX</span>
            <span className={styles.brandId}>ID</span>
            <span className={styles.brandDot}></span>
          </Link>
          <nav className={styles.links}>
            <Link href="/#promo">Promotions</Link>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setCurrentTab('coming-soon')}
            >
              Coming Soon
            </button>
            <Link href="/#fitur">Fitur Pendukung</Link>
          </nav>
        </div>
      </header>

      <main className={styles.moviesContainer}>
        <div className={styles.pageHeader}>
          <Link href="/" className={styles.backBtn}>
            &lsaquo;
          </Link>
          <h1 className={styles.pageTitle}>All Movies</h1>
        </div>

        <div className={styles.tabsWrapper}>
          <button
            type="button"
            className={`${styles.tabBtn} ${currentTab === 'now-showing' ? styles.tabBtnActive : ''}`}
            onClick={() => setCurrentTab('now-showing')}
          >
            NOW SHOWING
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${currentTab === 'coming-soon' ? styles.tabBtnActive : ''}`}
            onClick={() => setCurrentTab('coming-soon')}
          >
            COMING SOON
          </button>
        </div>

        <div className={styles.moviesGrid}>
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className={styles.movieCard}
              >
                <div className={styles.moviePosterWrap}>
                  <img src={movie.poster} alt={movie.title} />
                </div>
                <h3 className={styles.movieCardTitle}>{movie.title}</h3>
                <span className={styles.movieCardDate}>Rilis: {movie.release}</span>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              Tidak ada film untuk kategori ini.
            </div>
          )}
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
        </div>
      </footer>
    </div>
  );
}