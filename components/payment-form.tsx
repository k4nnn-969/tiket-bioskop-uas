"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookingOrder } from "@/lib/booking-types";
import { formatRupiah, formatShowDate, MovieArtwork } from "@/components/booking-header";

type OrderResponse = BookingOrder | { error: string };
const paymentMethods = [
  { value: "qris", label: "QRIS", detail: "Scan dengan aplikasi pembayaran pilihanmu" },
  { value: "bank-transfer", label: "Transfer bank", detail: "Virtual account · simulasi pembayaran" },
  { value: "e-wallet", label: "E-wallet", detail: "Pembayaran praktis dari dompet digital" },
];

export function PaymentForm({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<BookingOrder | null>(null);
  const [method, setMethod] = useState("qris");
  const [loading, setLoading] = useState(Boolean(orderId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(orderId ? "" : "ID pesanan tidak ditemukan. Silakan mulai dari pemilihan kursi.");

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    fetch(`/api/orders/${encodeURIComponent(orderId)}`)
      .then(async (response) => {
        const result = (await response.json()) as OrderResponse;
        if (!response.ok || "error" in result) {
          throw new Error("error" in result ? result.error : "Detail pesanan tidak dapat dimuat.");
        }
        if (active) setOrder(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Detail pesanan tidak dapat dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [orderId]);

  async function pay() {
    if (!order || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(order.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: method }),
      });
      const result = (await response.json()) as OrderResponse;
      if (!response.ok || "error" in result) {
        throw new Error("error" in result ? result.error : "Pembayaran gagal.");
      }
      setOrder(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Pembayaran gagal.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="surface content-card state-message">Memuat pesanan…</div>;
  if (error && !order) {
    return (
      <div className="surface content-card">
        <div className="state-message">{error}</div>
        <Link href="/seat-selection" className="primary-button">Pilih kursi</Link>
      </div>
    );
  }
  if (!order) return null;

  if (order.status === "paid") {
    return (
      <section className="surface content-card" aria-live="polite">
        <div className="success-icon">✓</div>
        <h2 style={{ textAlign: "center", marginBottom: 4 }}>Pembayaran berhasil!</h2>
        <p className="success-copy" style={{ textAlign: "center" }}>
          Tiket Senja Terakhir sudah tersimpan. Kode pesananmu <strong>{order.id.slice(0, 8).toUpperCase()}</strong>.
        </p>
        <div className="data-row"><span>Jadwal</span><strong>{formatShowDate(order.showDate)}, {order.showTime}</strong></div>
        <div className="data-row"><span>Kursi</span><strong>{order.seats.join(", ")}</strong></div>
        <div className="data-row"><span>Metode pembayaran</span><strong>{paymentMethods.find((item) => item.value === order.paymentMethod)?.label ?? order.paymentMethod}</strong></div>
        <div className="total-block"><span>Total dibayar</span><strong>{formatRupiah(order.total)}</strong></div>
        <div className="card-actions"><Link href="/seat-selection" className="primary-button">Selesai</Link></div>
        <p className="fine-print">Pembayaran pada project demo ini disimulasikan dan tidak memproses uang sungguhan.</p>
      </section>
    );
  }

  return (
    <section className="surface content-card">
      <div className="booking-movie">
        <MovieArtwork />
        <div className="movie-info">
          <h3>Senja Terakhir</h3>
          <p>{formatShowDate(order.showDate)}</p>
          <p>{order.showTime} WIB · Kursi {order.seats.join(", ")}</p>
        </div>
      </div>
      <h2 style={{ marginTop: 24 }}>Pilih metode pembayaran</h2>
      {paymentMethods.map((item) => (
        <label className="payment-option" key={item.value}>
          <input checked={method === item.value} name="payment-method" onChange={() => setMethod(item.value)} type="radio" />
          <span>{item.label}<small>{item.detail}</small></span>
        </label>
      ))}
      <div className="total-block"><span>Total pembayaran</span><strong>{formatRupiah(order.total)}</strong></div>
      {error && <div className="notice" role="alert">{error}</div>}
      <div className="card-actions">
        <button className="primary-button" disabled={submitting} onClick={pay} type="button">
          {submitting ? "Memproses…" : `Bayar ${formatRupiah(order.total)}`}
        </button>
        <Link className="back-link" href={`/order-summary?id=${encodeURIComponent(order.id)}`}>← Kembali ke ringkasan</Link>
      </div>
      <p className="fine-print">Ini adalah simulasi pembayaran untuk keperluan project UAS. Tidak ada transaksi uang sungguhan.</p>
    </section>
  );
}
