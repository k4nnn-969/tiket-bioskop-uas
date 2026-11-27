"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { getLocalUser, logoutLocalUser, updateLocalProfile, type LocalUserSummary } from "@/lib/local-auth";
import { AccountShell } from "./account-shell";
import styles from "./account.module.css";

export function ProfilePage() {
  const [user, setUser] = useState<LocalUserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    function refresh() {
      try { setUser(getLocalUser()); setError(""); setEditing(false); }
      catch { setUser(null); setError("Akun lokal tidak dapat dibaca. Periksa izin penyimpanan browser."); }
      finally { setLoading(false); }
    }
    refresh();
    window.addEventListener("tix-auth-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("tix-auth-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage("");
    try { setUser(updateLocalProfile(name, phone)); setEditing(false); setMessage("Profil berhasil diperbarui."); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Profil gagal disimpan."); }
  }

  return <AccountShell title="Profile saya" description="Kenali akunmu. Lengkapi profil untuk pengalaman menonton yang lebih personal.">
    {error && <p className={styles.error} role="alert">{error}</p>}
    {message && <p className={styles.success} role="status">{message}</p>}
    {loading ? <p className={styles.empty} role="status">Memuat profil…</p> : !user ?
      <section className={styles.empty}><h2>Yuk, kenalan dulu!</h2><p>Login untuk melihat dan mengedit profil kamu.</p><Link href="/login" className={styles.primary}>Login / Daftar</Link></section> :
      <div className={styles.profileGrid}>
        <aside className={styles.card}>
          <div className={styles.avatar} aria-hidden="true">{user.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase()}</div>
          <h2>{user.name}</h2><p className={styles.muted}>{user.email}</p><span className={styles.badge}>Akun lokal · Movie lover</span>
          <div className={styles.actions}><Link href="/history" className={styles.secondary}>Lihat riwayat</Link><button className={styles.secondary} type="button" onClick={() => {
            try { logoutLocalUser(); setMessage(""); } catch { setError("Logout gagal. Coba kembali."); }
          }}>Keluar akun</button></div>
        </aside>
        <section className={styles.card}>
          <p className={styles.kicker}>INFORMASI PRIBADI</p><h2>Detail akun</h2><p className={styles.muted}>Kelola informasi yang ditampilkan di profilmu.</p>
          {editing ? <form onSubmit={save} className={styles.form}>
            <label>Nama lengkap<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} required /></label>
            <label>Email<input type="email" value={user.email} readOnly aria-describedby="email-note" /></label>
            <small id="email-note" className={styles.muted}>Email adalah identitas login dan tidak dapat diubah pada demo ini.</small>
            <label>Nomor telepon (opsional)<input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Contoh: +6281234567890" maxLength={16} /></label>
            <div className={styles.actions}><button className={styles.primary} type="submit">Simpan perubahan</button><button className={styles.secondary} type="button" onClick={() => { setEditing(false); setError(""); }}>Batal</button></div>
          </form> : <><dl className={styles.details}><div><dt>Nama lengkap</dt><dd>{user.name}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Nomor telepon</dt><dd>{user.phone || "Belum ditambahkan"}</dd></div><div><dt>Penyimpanan akun</dt><dd>Browser ini saja</dd></div></dl><button type="button" className={styles.primary} onClick={() => { setName(user.name); setPhone(user.phone ?? ""); setEditing(true); setMessage(""); }}>Edit profile</button></>}
        </section>
      </div>}
  </AccountShell>;
}