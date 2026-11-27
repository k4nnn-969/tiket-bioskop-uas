import Link from "next/link";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <Link className={styles.brand} href="/promotions" aria-label="TIX ID beranda">
            <span>TIX</span><i aria-hidden="true" /><b>ID</b>
          </Link>
          <p className={styles.caption}>Cari film. Pesan tiket. Nikmati ceritanya.</p>
        </div>
        <nav className={styles.links} aria-label="Navigasi footer">
          <Link href="/promotions">Promotions</Link>
          <Link href="/coming-soon">Coming Soon</Link>
          <Link href="/booking">Pemesanan tiket</Link>
          <Link href="/login">Akun lokal</Link>
        </nav>
      </div>
    </footer>
  );
}
