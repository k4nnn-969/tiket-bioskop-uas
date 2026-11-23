"use client";

import { useCallback, useEffect, useState } from "react";
import { BookingHeader } from "@/components/booking-header";
import { OrderSummary } from "@/components/order-summary";
import { PaymentSection } from "@/components/payment-section";
import { SeatSelection } from "@/components/seat-selection";
import type { BookingResponse, PaidBooking, Showtime, ShowtimeResponse } from "@/lib/booking-types";

export default function BookingPage() {
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [ticket, setTicket] = useState<PaidBooking | null>(null);
  const [loadingShowtime, setLoadingShowtime] = useState(true);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const refreshShowtime = useCallback(async () => {
    const response = await fetch("/api/showtimes/default", { cache: "no-store" });
    const result = (await response.json()) as ShowtimeResponse | { error: string };
    if (!response.ok || "error" in result) {
      throw new Error("error" in result ? result.error : "Jadwal tidak dapat dimuat.");
    }
    setShowtime(result);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/showtimes/default", { cache: "no-store" })
      .then(async (response) => {
        const result = (await response.json()) as ShowtimeResponse | { error: string };
        if (!response.ok || "error" in result) {
          throw new Error("error" in result ? result.error : "Jadwal tidak dapat dimuat.");
        }
        if (active) setShowtime(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Jadwal tidak dapat dimuat.");
      })
      .finally(() => {
        if (active) setLoadingShowtime(false);
      });

    const ticketId = new URLSearchParams(window.location.search).get("ticket");
    if (ticketId) {
      queueMicrotask(() => {
        if (!active) return;
        setLoadingTicket(true);
        fetch(`/api/bookings/${encodeURIComponent(ticketId)}`, { cache: "no-store" })
          .then(async (response) => {
            const result = (await response.json()) as BookingResponse;
            if (!response.ok || "error" in result) {
              throw new Error("error" in result ? result.error : "E-Ticket tidak dapat dimuat.");
            }
            if (active) {
              setTicket(result);
              setStep(3);
            }
          })
          .catch((cause: unknown) => {
            if (active) setError(cause instanceof Error ? cause.message : "E-Ticket tidak dapat dimuat.");
          })
          .finally(() => {
            if (active) setLoadingTicket(false);
          });
      });
    }
    return () => {
      active = false;
    };
  }, []);

  function toggleSeat(seat: string) {
    setError("");
    setSelectedSeats((seats) => {
      if (seats.includes(seat)) return seats.filter((item) => item !== seat);
      if (seats.length >= 6) return seats;
      return [...seats, seat];
    });
  }

  async function pay() {
    if (!showtime || !selectedSeats.length || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showtimeId: showtime.id, selectedSeats, paymentMethod }),
      });
      const result = (await response.json()) as BookingResponse;
      if (!response.ok || "error" in result) {
        if (response.status === 409) await refreshShowtime();
        throw new Error("error" in result ? result.error : "Pembayaran tidak dapat diproses.");
      }
      setTicket(result);
      setStep(3);
      window.history.replaceState(null, "", `/booking?ticket=${encodeURIComponent(result.id)}`);
      await refreshShowtime();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Pembayaran tidak dapat diproses.");
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    setSelectedSeats([]);
    setTicket(null);
    setStep(1);
    setError("");
    window.history.replaceState(null, "", "/booking");
  }

  const activeShowtime = ticket?.showtime ?? showtime;
  const loading = loadingShowtime || loadingTicket;

  return (
    <div className="booking-shell min-h-screen">
      <div className="booking-container">
        <BookingHeader currentStep={step} showtime={activeShowtime} />
        <main className="page-content">
          {loading && <div className="surface loading-card"><div>Memuat informasi pemesanan…<div className="seat-skeleton" /></div></div>}
          {!loading && !showtime && !ticket && (
            <section className="surface loading-card" role="alert">{error || "Jadwal belum tersedia."}</section>
          )}
          {!loading && showtime && step === 1 && !ticket && (
            <SeatSelection
              showtime={showtime}
              selectedSeats={selectedSeats}
              error={error}
              onToggleSeat={toggleSeat}
              onContinue={() => { setError(""); setStep(2); }}
              loading={false}
            />
          )}
          {!loading && showtime && step === 2 && !ticket && (
            <OrderSummary
              showtime={showtime}
              selectedSeats={selectedSeats}
              error={error}
              onBack={() => { setError(""); setStep(1); }}
              onContinue={() => { setError(""); setStep(3); }}
            />
          )}
          {!loading && showtime && step === 3 && (
            <PaymentSection
              showtime={showtime}
              selectedSeats={selectedSeats}
              paymentMethod={paymentMethod}
              ticket={ticket}
              error={error}
              submitting={submitting}
              onChangeMethod={setPaymentMethod}
              onPay={pay}
              onBack={() => { setError(""); setStep(2); }}
              onStartOver={startOver}
            />
          )}
        </main>
      </div>
    </div>
  );
}
