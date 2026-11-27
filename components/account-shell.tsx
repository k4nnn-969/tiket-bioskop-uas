"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import styles from "./account.module.css";

export function AccountShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const pathname = usePathname();
  return <div className={styles.page}>
    <div className={styles.noPrint}><SiteHeader /></div>
    <section className={styles.hero}>
      <div className={styles.container}><p className={styles.eyebrow}>MY TIX · YOUR MOVIE JOURNEY</p><h1>{title}</h1><p>{description}</p></div>
    </section>
    <main className={styles.container}>
      <nav className={styles.tabs} aria-label="Menu akun">
        {[["/profile", "Profile"], ["/eticket", "E-Ticket"], ["/history", "History"]].map(([href, label]) =>
          <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>,
        )}
      </nav>
      <div className={styles.content}>{children}</div>
      <p className={`${styles.disclaimer} ${styles.noPrint}`}>Demo UAS · Akun dan indeks riwayat tersimpan di browser ini. Pembayaran tidak memproses uang sungguhan.</p>
    </main>
    <div className={styles.noPrint}><SiteFooter /></div>
  </div>;
}