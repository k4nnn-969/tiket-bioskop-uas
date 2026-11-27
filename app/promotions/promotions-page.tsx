"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { promotions } from "@/lib/cinema-content";
import styles from "./promotions.module.css";

export function PromotionsPage() {
  const [message, setMessage] = useState("");

  async function copyCode(code: string) {
    if (!navigator.clipboard) {
      setMessage(`Salin kode promo ini: ${code}`);
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setMessage(`Kode ${code} berhasil disalin.`);
    } catch {
      setMessage(`Kode promo ${code}: salin secara manual.`);
    }
  }

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroImage} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Lebih hemat, lebih seru</p>
            <h1>Waktunya nonton <span>lebih hemat.</span></h1>
            <p className={styles.heroCopy}>
              Temukan penawaran spesial untuk film favoritmu dan buat setiap
              cerita di layar lebar jadi lebih berkesan.
            </p>
            <Link className={styles.primaryButton} href="/coming-soon">
              Jelajahi film <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="promo-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>Pilihan untukmu</p>
              <h2 id="promo-title">Promo pilihan minggu ini</h2>
              <p className={styles.description}>
                Nikmati pengalaman menonton dengan penawaran spesial dari TIX ID.
              </p>
            </div>
            <span className={styles.offerCount}>03 penawaran</span>
          </div>

          <div className={styles.promoGrid}>
            {promotions.map((promo, index) => (
              <article
                className={`${styles.promoCard} ${index === 0 ? styles.featuredCard : ""}`}
                key={promo.code}
                style={{ backgroundImage: `url("${promo.image}")` }}
              >
                <span className={styles.promoTag}>{promo.tag}</span>
                <div className={styles.promoCopy}>
                  <h3>{promo.title}</h3>
                  <p>{promo.description}</p>
                  <button
                    className={styles.promoCode}
                    onClick={() => void copyCode(promo.code)}
                    type="button"
                    aria-label={`Salin kode promo ${promo.code}`}
                  >
                    KODE: {promo.code} <span aria-hidden="true">⧉</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.promoDisclaimer}>
            Promo merupakan simulasi untuk demo. Ketentuan dapat berbeda di
            setiap bioskop.
          </p>
          <p className={styles.toast} role="status" aria-live="polite">
            {message}
          </p>
        </section>

        <section className={styles.cta}>
          <div>
            <p className={styles.kicker}>Siap menonton?</p>
            <h2>Cerita seru berikutnya sudah menunggu.</h2>
          </div>
          <Link className={styles.secondaryButton} href="/booking">
            Pesan tiket <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
