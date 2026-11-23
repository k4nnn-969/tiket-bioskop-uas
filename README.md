# Tiket Bioskop UAS

Demo pemesanan tiket bioskop dengan Next.js App Router, React, TypeScript, dan SQLite. UI berbahasa Indonesia dengan tema merah yang terinspirasi aplikasi pemesanan tiket.

## Menjalankan aplikasi

Persyaratan: Node.js 20.19 atau lebih baru.

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Database SQLite dibuat otomatis di `data/bookings.sqlite` saat endpoint pemesanan pertama kali digunakan; file database lokal tidak ikut disimpan ke Git.

## Alur demo

1. Pilih tanggal, jam tayang, dan 1–6 kursi.
2. Tinjau ringkasan pesanan.
3. Pilih QRIS, transfer bank, atau e-wallet lalu tekan tombol bayar.
4. Pesanan dan status pembayarannya disimpan di SQLite.

Pemesanan kursi berlaku selama 15 menit. Kursi yang sudah dipesan atau telah dibayar tidak bisa dipesan kembali pada jadwal yang sama. Pembayaran adalah simulasi untuk tugas kuliah dan tidak memproses uang sungguhan.

## Endpoint API

- `GET /api/seats?showtime=YYYY-MM-DD%7CHH%3AMM` — kursi yang tidak tersedia pada jadwal.
- `POST /api/orders` — membuat pesanan dan menahan kursi sementara.
- `GET /api/orders/:id` — melihat detail dan status pesanan.
- `PATCH /api/orders/:id` — menyelesaikan simulasi pembayaran.

Harga tiket dan biaya layanan dihitung di server, bukan dipercaya dari browser. `POST /api/orders` juga memvalidasi jumlah/format kursi dan menolak kursi yang sudah diambil.
