import { BookingHeader } from "@/components/booking-header";
import { OrderSummary } from "@/components/order-summary";

export default async function OrderSummaryPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return (
    <>
      <BookingHeader currentStep={2} />
      <main className="page-shell">
        <div className="page-heading">
          <div className="eyebrow">Satu langkah lagi</div>
          <h1>Ringkasan pesanan</h1>
          <p>Pastikan detail tiketmu sudah benar sebelum membayar.</p>
        </div>
        <OrderSummary key={id ?? "missing"} orderId={id ?? ""} />
      </main>
    </>
  );
}
