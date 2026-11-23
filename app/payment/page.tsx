import { BookingHeader } from "@/components/booking-header";
import { PaymentForm } from "@/components/payment-form";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return (
    <>
      <BookingHeader currentStep={3} />
      <main className="page-shell">
        <div className="page-heading">
          <div className="eyebrow">Pembayaran aman</div>
          <h1>Selesaikan pembayaran</h1>
          <p>Pilih metode pembayaran yang paling nyaman untukmu.</p>
        </div>
        <PaymentForm key={id ?? "missing"} orderId={id ?? ""} />
      </main>
    </>
  );
}
