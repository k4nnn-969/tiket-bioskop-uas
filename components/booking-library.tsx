"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { BookingResponse, PaidBooking } from "@/lib/booking-types";
import { getLocalUser } from "@/lib/local-auth";
import { readBookingReferences } from "@/lib/local-bookings";
import { formatRupiah, formatShowDate } from "./booking-header";
import { AccountShell } from "./account-shell";
import styles from "./account.module.css";

type Ticket = PaidBooking & { customerName: string };
const paymentNames: Record<string, string> = { qris: "QRIS", "m-tix-balance": "m.tix Balance", "virtual-account": "Virtual Account" };
const statusNames: Record<string, string> = { PAID: "Berhasil", CANCELLED: "Dibatalkan", PENDING: "Menunggu pembayaran" };

function transactionDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(value));
}

export function BookingLibrary({ mode }: { mode: "history" | "ticket" }) {
  return <AccountShell title={mode === "history" ? "History pemesanan" : "E-Ticket saya"} description={mode === "history" ? "Setiap film punya cerita. Temukan kembali perjalanan menontonmu di sini." : "Semua detail menontonmu dalam satu tiket digital."}>
    <Suspense fallback={<p className={styles.empty} role="status">Memuat tiket…</p>}><LibraryContent mode={mode} /></Suspense>
  </AccountShell>;
}

function LibraryContent({ mode }: { mode: "history" | "ticket" }) {
  const params = useSearchParams();
  const selectedId = mode === "ticket" ? params.get("ticket") : null;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError(""); setTickets([]);
      try {
        const references = readBookingReferences(getLocalUser());
        const requested = selectedId ? [{ id: selectedId, customerName: references.find((item) => item.id === selectedId)?.customerName ?? "Tidak tercatat (tautan tiket)" }] : references;
        const results = await Promise.allSettled(requested.map(async (reference): Promise<Ticket> => {
          const response = await fetch(`/api/bookings/${encodeURIComponent(reference.id)}`, { cache: "no-store", signal: controller.signal });
          const booking = await response.json() as BookingResponse;
          if (!response.ok || "error" in booking) throw new Error("error" in booking ? booking.error : "Tiket gagal dimuat.");
          return { ...booking, customerName: reference.customerName };
        }));
        if (!active) return;
        setTickets(results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
        const failed = results.filter((result) => result.status === "rejected");
        if (failed.length) setError(`${failed.length} tiket gagal dimuat atau tidak ditemukan. Coba muat ulang; data riwayat tidak dihapus.`);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Riwayat tidak dapat dimuat.");
      } finally { if (active) setLoading(false); }
    }
    void load();
    function refresh() { setRetry((value) => value + 1); }
    window.addEventListener("tix-auth-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { active = false; controller.abort(); window.removeEventListener("tix-auth-change", refresh); window.removeEventListener("storage", refresh); };
  }, [selectedId, retry]);

  const filtered = tickets.filter((ticket) => (filter === "ALL" || ticket.status === filter) && `${ticket.showtime.movieTitle} ${ticket.bookingCode} ${ticket.showtime.cinema}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    {error && <div className={styles.error} role="alert">{error} <button type="button" className={styles.secondary} onClick={() => setRetry((value) => value + 1)}>Coba lagi</button></div>}
    {loading ? <p role="status" className={styles.empty}>Memuat data pemesanan…</p> : selectedId ? <>
      <Link className={`${styles.back} ${styles.noPrint}`} href="/eticket">← Semua E-Ticket</Link>
      {tickets[0] ? <TicketDetail ticket={tickets[0]} /> : <section className={styles.empty}><h2>Tiket tidak tersedia</h2><p>Periksa tautan tiket atau coba muat ulang.</p></section>}
    </> : <>
      <div className={styles.toolbar}>
        <div><p className={styles.kicker}>KOLEKSI PEMESANAN</p><h2>{tickets.length} pemesanan tersimpan</h2></div>
        <Link href="/booking" className={styles.primary}>Pesan tiket baru</Link>
      </div>
      <div className={styles.filters}>
        <label>Cari film, bioskop, atau kode booking<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari pemesanan…" /></label>
        <label>Status transaksi<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="ALL">Semua status</option>{Object.entries(statusNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>
      {!filtered.length ? <section className={styles.empty}><span className={styles.emptyIcon} aria-hidden="true">🎟</span><h2>{tickets.length ? "Pemesanan tidak ditemukan" : "Cerita menontonmu dimulai di sini"}</h2><p>{tickets.length ? "Coba kata kunci atau filter status lainnya." : "Tiket yang dibeli setelah fitur ini tersedia akan muncul di sini. Riwayat tamu dan setiap akun disimpan terpisah."}</p>{!tickets.length && <Link href="/booking" className={styles.primary}>Pilih kursi sekarang</Link>}</section> :
        <div className={styles.list}>{filtered.map((ticket) => <article key={ticket.id} className={styles.bookingCard}>
          <div className={styles.filmArt} aria-hidden="true"><span>TIX</span><strong>{ticket.showtime.rating}</strong></div>
          <div className={styles.bookingInfo}><span className={styles.badge}>{statusNames[ticket.status] ?? ticket.status}</span><h2>{ticket.showtime.movieTitle}</h2><p>{ticket.showtime.cinema} · {ticket.showtime.studio}</p><p>{formatShowDate(ticket.showtime.showDate)} · {ticket.showtime.showTime} WIB</p><p>Kursi <strong>{ticket.seats.join(", ")}</strong></p><small className={styles.muted}>Transaksi {transactionDate(ticket.createdAt)} WIB · #{ticket.bookingCode}</small></div>
          <div className={styles.bookingAction}><small>Total pembayaran</small><strong>{formatRupiah(ticket.totalAmount)}</strong><Link className={styles.primary} href={`/eticket?ticket=${encodeURIComponent(ticket.id)}`}>Lihat E-Ticket →</Link></div>
        </article>)}</div>}
      <p className={styles.disclaimer}>Detail bersumber dari database pemesanan. Riwayat lama yang belum dicatat di browser tidak otomatis ditautkan ke akun.</p>
    </>}
  </>;
}

function TicketDetail({ ticket }: { ticket: Ticket }) {
  return <div className={styles.ticketLayout}>
    <article className={styles.ticket}>
      <div className={styles.ticketTop}><div className={styles.toolbar}><span className={styles.eyebrow}>TIX ID · E-TICKET</span><span className={styles.badge}>{statusNames[ticket.status] ?? ticket.status}</span></div><h2>{ticket.showtime.movieTitle}</h2><p>{ticket.showtime.cinema} · {ticket.showtime.studio}</p><p>{ticket.showtime.rating}</p></div>
      <div className={styles.ticketBody}><dl className={styles.details}>
        <div><dt>Tanggal tayang</dt><dd>{formatShowDate(ticket.showtime.showDate)}</dd></div><div><dt>Jam tayang</dt><dd>{ticket.showtime.showTime} WIB</dd></div><div><dt>Kursi ({ticket.seats.length})</dt><dd>{ticket.seats.slice().sort().join(", ")}</dd></div><div><dt>Nama pemesan</dt><dd>{ticket.customerName}</dd></div>
      </dl></div>
      <div className={styles.ticketCode}><p>KODE BOOKING / PASS KEY</p><strong>{ticket.bookingCode}</strong><small>Simpan kode booking ini untuk referensi pemesanan demo.</small></div>
    </article>
    <aside className={styles.card}><p className={styles.kicker}>RINGKASAN PEMBAYARAN</p><h2>Detail transaksi</h2><dl className={styles.receipt}>
      <div><dt>Tanggal transaksi</dt><dd>{transactionDate(ticket.createdAt)} WIB</dd></div><div><dt>Metode pembayaran</dt><dd>{paymentNames[ticket.paymentMethod] ?? ticket.paymentMethod}</dd></div><div><dt>Tiket × {ticket.seats.length}</dt><dd>{formatRupiah(ticket.showtime.ticketPrice * ticket.seats.length)}</dd></div><div><dt>Biaya admin × {ticket.seats.length}</dt><dd>{formatRupiah(ticket.showtime.adminFee * ticket.seats.length)}</dd></div><div><dt>Total pembayaran</dt><dd><strong>{formatRupiah(ticket.totalAmount)}</strong></dd></div>
    </dl><div className={`${styles.actions} ${styles.noPrint}`}><button className={styles.primary} type="button" onClick={() => window.print()}>Cetak / Simpan PDF</button><Link className={styles.secondary} href="/history">Lihat history</Link></div><p className={styles.disclaimer}>Tiket simulasi UAS, bukan tiket masuk bioskop sungguhan. Pilih “Save as PDF” pada dialog cetak untuk mengunduh.</p></aside>
  </div>;
}