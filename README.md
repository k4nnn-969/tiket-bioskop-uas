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

## Profile, E-Ticket, dan History

- `/profile`: profil akun lokal, avatar inisial, edit nama/nomor telepon, dan logout. Email tetap menjadi identitas akun.
- `/history`: pencarian dan filter transaksi yang dicatat pada browser ini, terurut dari terbaru.
- `/eticket`: daftar tiket; `/eticket?ticket=<id>` menampilkan detail dan tombol cetak/simpan PDF melalui dialog browser.

ID transaksi baru dicatat setelah checkout berhasil. Detail tiket tetap diambil dari API database yang sudah ada, bukan mock transaksi. Riwayat tamu dan setiap email akun dipisahkan. Transaksi lama belum otomatis masuk indeks lokal; tautan tiket lama masih dapat dibuka. Nama pemesan merupakan snapshot profil saat checkout, bukan data kepemilikan dari server.

**Batas keamanan demo:** login lokal dan indeks browser bukan otorisasi server. API tiket yang sudah ada dapat dibuka melalui ID tiket; jangan gunakan data pribadi atau pembayaran nyata. Produksi membutuhkan sesi server serta relasi booking ke user. Menghapus data browser menghapus indeks riwayat, tetapi tidak menghapus transaksi database.

Validasi tambahan: `npx tsx --test lib/account.test.ts` dan `npx tsc --noEmit`. Untuk uji manual, daftar/login, edit profil, lakukan pemesanan, buka History lalu E-Ticket, dan coba cetak PDF. Periksa juga pada lebar 375px, 768px, dan desktop.

## Endpoint API

- `GET /api/showtimes/default` atau `GET /api/showtimes/:id` — detail jadwal serta kursi yang terisi.
- `POST /api/bookings` — validasi kursi, hitung total di server, lalu simpan booking dan kursi dalam satu transaksi.
- `GET /api/bookings/:id` — mengambil kembali data E-Ticket.
