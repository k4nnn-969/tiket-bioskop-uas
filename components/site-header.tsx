"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLocalUser, logoutLocalUser, type LocalUserSummary } from "@/lib/local-auth";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<LocalUserSummary | null>(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    function refreshUser() {
      try {
        setUser(getLocalUser());
        setAuthError("");
      } catch (cause) {
        setAuthError(cause instanceof Error ? cause.message : "Akun lokal tidak dapat dibaca.");
      }
    }

    refreshUser();
    window.addEventListener("tix-auth-change", refreshUser);
    return () => window.removeEventListener("tix-auth-change", refreshUser);
  }, []);

  function logout() {
    try {
      logoutLocalUser();
      setUser(null);
      setAuthError("");
    } catch (cause) {
      setAuthError(cause instanceof Error ? cause.message : "Logout tidak dapat diproses.");
    }
  }

  return (
    <>
      <div className={styles.topline} />
      <header className={styles.header}>
        <div className={styles.nav}>
          <Link className={styles.brand} href="/promotions" aria-label="TIX ID beranda">
            <span>TIX</span><i aria-hidden="true" /><b>ID</b>
          </Link>
          <button
            aria-controls="site-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            className={styles.menu}
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <nav
            aria-label="Navigasi utama"
            className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}
            id="site-navigation"
          >
            <Link href="/booking" onClick={() => setMenuOpen(false)}>Movies</Link>
            <Link href="/booking" onClick={() => setMenuOpen(false)}>Bioskop &amp; Jadwal</Link>
            <Link href="/promotions" onClick={() => setMenuOpen(false)}>Promotions</Link>
            <Link href="/coming-soon" onClick={() => setMenuOpen(false)}>Coming Soon</Link>
          </nav>
          <div className={styles.actions}>
            <span className={styles.location}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Jakarta
            </span>
            {user ? (
              <>
                <span className={styles.userName}>Hai, {user.name}</span>
                <button className={styles.loginButton} onClick={logout} type="button">Keluar</button>
              </>
            ) : (
              <Link className={styles.loginButton} href="/login">Login / Daftar</Link>
            )}
          </div>
        </div>
      </header>
      {authError && <p className={styles.authError} role="alert">{authError}</p>}
    </>
  );
}
