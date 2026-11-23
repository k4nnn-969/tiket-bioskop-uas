"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookingOrder } from "@/lib/booking-types";
import { formatRupiah, formatShowDate, MovieArtwork } from "@/components/booking-header";

type OrderResponse = BookingOrder | { error: string };

export function OrderSummary({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<BookingOrder | null>(null);
  const [error, setError] = useState(orderId ? "" : "ID pesanan tidak ditemukan. Silakan pilih kursi terlebih dahulu.");
  const [loading, setLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    fetch(`/api/orders/${encodeURIComponent(orderId)}`)
      .then(async (response) => {
        const result = (await response.json()) as OrderResponse;
        if (!response.ok || "error" in result) {
          throw new Error("error" in result ? result.error : "Pesanan tidak dapat dimuat.");
        }
        if (active) setOrder(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Pesanan tidak dapat dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) return <div className="surface content-card state-message">Memuat detail pesanan…</div>;
  if (error || !order) {
    return (
      <div className="surface content-card">
        <div className="state-message">{error || "Pesanan tidak ditemukan."}</div>
        <Link href="/seat-selection" className="primary-button">Pilih kursi</Link>
      </div>
    );
  }

  return (
    <section className="surface content-card">
      <div className="booking-movie">
        <MovieArtwork />
        <div className="movie-info">
          <h3>Senja Terakhir</h3>
          <p>Drama · Studio 3 · Jakarta</p>
          <p><span className={`status-pill ${order.status === "paid" ? "paid" : ""}`}>{order.status === "paid" ? "Lunas" : "Menunggu pembayaran"}</span></p>
        </div>
      </div>
      <h2 style={{ marginTop: 24 }}>Detail tiket</h2>
      <div className="data-row"><span>Tanggal</span><strong>{formatShowDate(order.showDate)}</strong></div>
      <div className="data-row"><span>Jam tayang</span><strong>{order.showTime} WIB</strong></div>
      <div className="data-row"><span>Kursi</span><strong>{order.seats.join(", ")}</strong></div>
      <div className="data-row"><span>Jumlah tiket</span><strong>{order.seats.length} tiket</strong></div>
      <div className="data-row"><span>Harga tiket</span><strong>{formatRupiah(order.subtotal)}</strong></div>
      <div className="data-row"><span>Biaya layanan</span><strong>{formatRupiah(order.serviceFee)}</strong></div>
      <div className="total-block"><span>Total pembayaran</span><strong>{formatRupiah(order.total)}</strong></div>
      <div className="card-actions">
        {order.status === "paid" ? (
          <div className="notice" role="status">Pesanan ini sudah dibayar dengan {order.paymentMethod}.</div>
        ) : (
          <Link className="primary-button" href={`/payment?id=${encodeURIComponent(order.id)}`}>Pilih pembayaran</Link>
        )}
        <Link className="back-link" href="/seat-selection">← Kembali pilih kursi</Link>
      </div>
    </section>
  );
}
