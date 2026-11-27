"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { upcomingMovies, type MovieGenre } from "@/lib/cinema-content";
import styles from "./coming-soon.module.css";

const filters: Array<{ label: string; value: MovieGenre | "all" }> = [
  { label: "Semua", value: "all" },
  { label: "Action", value: "action" },
  { label: "Drama", value: "drama" },
  { label: "Keluarga", value: "family" },
];

export function ComingSoonPage() {
  const [genre, setGenre] = useState<MovieGenre | "all">("all");
  const [search, setSearch] = useState("");
  const [reminders, setReminders] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const visibleMovies = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id");
    return upcomingMovies.filter((movie) => {
      const matchesGenre = genre === "all" || movie.genre === genre;
      const matchesQuery = !query || movie.title.toLocaleLowerCase("id").includes(query);
      return matchesGenre && matchesQuery;
    });
  }, [genre, search]);

  function toggleReminder(title: string) {
    const isSet = reminders.includes(title);
    setReminders((current) => isSet
      ? current.filter((item) => item !== title)
      : [...current, title]);
    setMessage(isSet ? `Pengingat ${title} dinonaktifkan.` : `Pengingat ${title} diaktifkan.`);
  }

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroImage} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Catat tanggalnya</p>
            <h1>Cerita baru, <span>segera hadir.</span></h1>
            <p className={styles.heroCopy}>
              Intip film pilihan yang sebentar lagi hadir di bioskop. Pilih
              favoritmu dan aktifkan pengingat supaya tidak ketinggalan.
            </p>
            <a className={styles.primaryButton} href="#films">
              Lihat film <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className={styles.section} id="films" aria-labelledby="films-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>Jadwal rilis pilihan</p>
              <h2 id="films-title">Segera tayang</h2>
              <p className={styles.description}>Pilih film yang ingin kamu tunggu.</p>
            </div>
            <label className={styles.searchBox}>
              <span className={styles.srOnly}>Cari film</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input
                type="search"
                placeholder="Cari judul film"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          <div className={styles.tools} role="group" aria-label="Filter genre film">
            {filters.map((filter) => (
              <button
                aria-pressed={genre === filter.value}
                className={styles.filter}
                key={filter.value}
                onClick={() => setGenre(filter.value)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>

          {visibleMovies.length ? (
            <div className={styles.movieGrid}>
              {visibleMovies.map((movie) => {
                const isSet = reminders.includes(movie.title);
                return (
                  <article className={styles.movieCard} key={movie.title}>
                    <div
                      className={styles.poster}
                      role="img"
                      aria-label={movie.posterDescription}
                      style={{ backgroundImage: `url("${movie.image}")` }}
                    >
                      <span className={styles.release}>Segera tayang</span>
                    </div>
                    <div className={styles.movieInfo}>
                      <p className={styles.genre}>{movie.genreLabel}</p>
                      <h3>{movie.title}</h3>
                      <p className={styles.date}>Mulai tayang {movie.releaseDate}</p>
                      <button
                        aria-pressed={isSet}
                        className={`${styles.remind} ${isSet ? styles.remindActive : ""}`}
                        onClick={() => toggleReminder(movie.title)}
                        type="button"
                      >
                        <span aria-hidden="true">{isSet ? "✓" : "♧"}</span>
                        {isSet ? "Pengingat aktif" : "Ingatkan saya"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className={styles.emptyState} role="status">
              Film tidak ditemukan. Coba kata kunci atau genre lain.
            </p>
          )}
          <p className={styles.toast} role="status" aria-live="polite">{message}</p>
        </section>

        <section className={styles.cta}>
          <div>
            <p className={styles.kicker}>Tidak sabar menonton?</p>
            <h2>Lihat penawaran tiket pilihan minggu ini.</h2>
          </div>
          <Link className={styles.secondaryButton} href="/promotions">
            Lihat promo <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
