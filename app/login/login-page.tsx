"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { loginLocalUser, registerLocalUser } from "@/lib/local-auth";
import styles from "./login.module.css";

type FormMode = "login" | "register";

export function LoginPage() {
  const [mode, setMode] = useState<FormMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const user = mode === "register"
        ? await registerLocalUser(name, email, password)
        : await loginLocalUser(email, password);
      setMessage(mode === "register"
        ? `Akun berhasil dibuat. Selamat datang, ${user.name}!`
        : `Login berhasil. Selamat datang, ${user.name}!`);
      setPassword("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Login tidak dapat diproses.");
    } finally {
      setSubmitting(false);
    }
  }

  function changeMode(nextMode: FormMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
  }

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <div className={styles.backdrop} aria-hidden="true" />
        <section className={styles.authCard} aria-labelledby="auth-title">
          <Link className={styles.brand} href="/promotions" aria-label="TIX ID, kembali ke promo">
            <span>TIX</span><i aria-hidden="true" /><b>ID</b>
          </Link>
          <p className={styles.localBadge}><span aria-hidden="true" /> DEMO LOKAL</p>
          <h1 id="auth-title">{mode === "login" ? "Selamat datang!" : "Buat akunmu"}</h1>
          <p className={styles.subtitle}>
            {mode === "login"
              ? "Masuk untuk melanjutkan pengalaman nontonmu."
              : "Daftar dan simpan pilihan film favoritmu."}
          </p>

          <div className={styles.tabs} role="tablist" aria-label="Login atau daftar">
            <button
              aria-selected={mode === "login"}
              className={styles.tab}
              id="login-tab"
              onClick={() => changeMode("login")}
              role="tab"
              type="button"
            >
              Login
            </button>
            <button
              aria-selected={mode === "register"}
              className={styles.tab}
              id="register-tab"
              onClick={() => changeMode("register")}
              role="tab"
              type="button"
            >
              Daftar
            </button>
          </div>

          <form
            aria-labelledby={`${mode}-tab`}
            className={styles.form}
            onSubmit={(event) => void submit(event)}
          >
            {mode === "register" && (
              <label className={styles.field}>
                Nama lengkap
                <input
                  autoComplete="name"
                  minLength={2}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nama kamu"
                  required
                  value={name}
                />
              </label>
            )}
            <label className={styles.field}>
              Email
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@email.com"
                required
                type="email"
                value={email}
              />
            </label>
            <label className={styles.field}>
              Kata sandi
              <input
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 6 karakter"
                required
                type="password"
                value={password}
              />
            </label>
            <button className={styles.submit} disabled={submitting} type="submit">
              {submitting ? "Memproses..." : mode === "login" ? "Login" : "Buat akun"}
            </button>
          </form>

          {error && <p className={styles.error} role="alert">{error}</p>}
          {message && <p className={styles.success} role="status">{message}</p>}

          <p className={styles.disclaimer}>
            Akun demo disimpan di browser ini saja. Jangan gunakan kata sandi
            penting; fitur ini bukan autentikasi untuk produksi.
          </p>
        </section>
        <Link className={styles.backLink} href="/promotions">← Kembali ke promotions</Link>
      </main>
      <SiteFooter />
    </div>
  );
}
