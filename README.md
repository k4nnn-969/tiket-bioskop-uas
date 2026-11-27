# Tiket Bioskop UAS

Demo full-stack pemesanan tiket bioskop dengan Next.js App Router, TypeScript, Tailwind CSS, dan Prisma ORM. Antarmuka mobile-first memakai palet gelap, aksen emas, dan hijau.

## Persiapan

1. Salin `.env.example` menjadi `.env` (untuk development lokal, URL SQLite sudah disetel).
2. Jalankan perintah berikut:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

PowerShell: `Copy-Item .env.example .env`

Buka [http://localhost:3000](http://localhost:3000). Database demo disimpan di `data/cinema-bookings.db`, terpisah dari file SQLite lama. Untuk PostgreSQL atau MySQL, ubah `provider` di `prisma/schema.prisma` dan sesuaikan `DATABASE_URL` di `.env`.

## Alur demo

1. Pilih kursi dari denah dan data keterisian di database.
2. Periksa ringkasan biaya tiket dan biaya admin m.tix.
3. Pilih m.tix Balance, QRIS, atau Virtual Account, lalu bayar untuk membuat transaksi dan E-Ticket.

Pembayaran merupakan simulasi, bukan pemrosesan uang sungguhan. Pemesanan maksimal enam kursi. Constraint unik database pada jadwal dan nomor kursi mencegah kursi ganda sekalipun dua transaksi berjalan bersamaan.

## Halaman tambahan

- `/promotions` — kartu promo dan salin kode demo.
- `/coming-soon` — daftar film mendatang dengan filter genre, pencarian, dan pengingat lokal.
- `/login` — login dan pendaftaran demo yang disimpan di `localStorage` browser.

Login lokal hanya untuk demonstrasi. Data akun tidak disinkronkan ke server dan bukan pengganti autentikasi produksi.

## API

- `GET /api/showtimes/default` atau `GET /api/showtimes/:id` — detail jadwal serta kursi yang terisi.
- `POST /api/bookings` — validasi kursi, hitung total di server, lalu simpan booking dan kursi dalam satu transaksi.
- `GET /api/bookings/:id` — mengambil kembali data E-Ticket.
