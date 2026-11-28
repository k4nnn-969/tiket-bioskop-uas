import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cinemasData = [
  // JAKARTA
  {
    slug: "grand-indonesia-xxi",
    name: "Grand Indonesia XXI",
    brand: "IMAX",
    city: "Jakarta",
    address: "Grand Indonesia West Mall Lt. 8, Jl. M.H. Thamrin No.1, Jakarta Pusat",
    phone: "(021) 2358-0221",
    operatingHours: "10:00 - 23:45 WIB",
    facilities: ["IMAX", "The Premiere", "Dolby Atmos", "XXI Cafe", "Musholla"],
    studioTypes: "Regular 2D, IMAX 2D, The Premiere",
    totalStudios: 11,
    ticketBaseInfo: "Senin–Kamis Rp 45.000 | Jumat Rp 50.000 | Sabtu–Minggu Rp 60.000",
    mapUrl: "https://maps.google.com/?q=Grand+Indonesia+XXI",
    baseRegPrice: 45000,
    hasImax: true,
    hasPremiere: true,
  },
  {
    slug: "plaza-senayan-xxi",
    name: "Plaza Senayan XXI",
    brand: "IMAX",
    city: "Jakarta",
    address: "Plaza Senayan Lt. 5, Jl. Asia Afrika No.8, Senayan, Jakarta Selatan",
    phone: "(021) 572-5555",
    operatingHours: "10:30 - 23:45 WIB",
    facilities: ["IMAX Laser", "Dolby Atmos", "The Premiere", "XXI Cafe", "Valet Parking"],
    studioTypes: "Regular 2D, IMAX Laser, The Premiere",
    totalStudios: 8,
    ticketBaseInfo: "Senin–Kamis Rp 50.000 | Jumat Rp 55.000 | Sabtu–Minggu Rp 65.000",
    mapUrl: "https://maps.google.com/?q=Plaza+Senayan+XXI",
    baseRegPrice: 50000,
    hasImax: true,
    hasPremiere: true,
  },
  {
    slug: "gandaria-city-xxi",
    name: "Gandaria City XXI",
    brand: "IMAX",
    city: "Jakarta",
    address: "Gandaria City Mall Lt. 2, Jl. Sultan Iskandar Muda, Jakarta Selatan",
    phone: "(021) 2905-3221",
    operatingHours: "10:00 - 23:30 WIB",
    facilities: ["IMAX", "The Premiere", "Dolby Atmos", "XXI Cafe", "Musholla"],
    studioTypes: "Regular 2D, IMAX 2D, The Premiere",
    totalStudios: 7,
    ticketBaseInfo: "Senin–Kamis Rp 45.000 | Jumat Rp 50.000 | Sabtu–Minggu Rp 60.000",
    mapUrl: "https://maps.google.com/?q=Gandaria+City+XXI",
    baseRegPrice: 45000,
    hasImax: true,
    hasPremiere: true,
  },
  {
    slug: "central-park-cgv",
    name: "CGV Central Park",
    brand: "CGV",
    city: "Jakarta",
    address: "Central Park Mall Lt. 8, Jl. Letjen S. Parman Kav. 28, Jakarta Barat",
    phone: "(021) 5698-5221",
    operatingHours: "10:00 - 23:45 WIB",
    facilities: ["4DX", "Velvet Class", "Dolby Atmos", "Sweetbox", "Self-Ticketing"],
    studioTypes: "Regular 2D, 4DX, Velvet Suite",
    totalStudios: 10,
    ticketBaseInfo: "Senin–Kamis Rp 45.000 | Jumat Rp 50.000 | Sabtu–Minggu Rp 60.000",
    mapUrl: "https://maps.google.com/?q=CGV+Central+Park",
    baseRegPrice: 45000,
    hasImax: false,
    hasPremiere: true,
  },
  {
    slug: "kelapa-gading-xxi",
    name: "Kelapa Gading XXI",
    brand: "XXI",
    city: "Jakarta",
    address: "Summarecon Mall Kelapa Gading 3 Lt. 3, Kelapa Gading, Jakarta Utara",
    phone: "(021) 4585-3621",
    operatingHours: "10:00 - 23:30 WIB",
    facilities: ["IMAX", "The Premiere", "Dolby Atmos", "XXI Cafe", "Musholla"],
    studioTypes: "Regular 2D, IMAX 2D, The Premiere",
    totalStudios: 10,
    ticketBaseInfo: "Senin–Kamis Rp 40.000 | Jumat Rp 45.000 | Sabtu–Minggu Rp 55.000",
    mapUrl: "https://maps.google.com/?q=Kelapa+Gading+XXI",
    baseRegPrice: 40000,
    hasImax: true,
    hasPremiere: true,
  },
  {
    slug: "bassura-xxi",
    name: "Bassura XXI",
    brand: "XXI",
    city: "Jakarta",
    address: "Mall@Bassura Lt. 2, Jl. Jend. Basuki Rachmat No.1A, Jatinegara, Jakarta Timur",
    phone: "(021) 2280-7121",
    operatingHours: "10:30 - 23:00 WIB",
    facilities: ["Dolby 7.1 Surround", "XXI Cafe", "Self-Ticketing", "Musholla"],
    studioTypes: "Regular 2D",
    totalStudios: 6,
    ticketBaseInfo: "Senin–Kamis Rp 35.000 | Jumat Rp 40.000 | Sabtu–Minggu Rp 50.000",
    mapUrl: "https://maps.google.com/?q=Bassura+XXI",
    baseRegPrice: 35000,
    hasImax: false,
    hasPremiere: false,
  },

  // BOGOR
  {
    slug: "botani-square-xxi",
    name: "Botani Square XXI",
    brand: "XXI",
    city: "Bogor",
    address: "Botani Square Lt. 2, Jl. Raya Pajajaran No.40, Bogor Tengah, Kota Bogor",
    phone: "(0251) 840-0821",
    operatingHours: "10:30 - 23:15 WIB",
    facilities: ["The Premiere", "Dolby Atmos", "XXI Cafe", "Musholla"],
    studioTypes: "Regular 2D, The Premiere",
    totalStudios: 7,
    ticketBaseInfo: "Senin–Kamis Rp 40.000 | Jumat Rp 45.000 | Sabtu–Minggu Rp 55.000",
    mapUrl: "https://maps.google.com/?q=Botani+Square+XXI+Bogor",
    baseRegPrice: 40000,
    hasImax: false,
    hasPremiere: true,
  },
  {
    slug: "aeon-sentul-city-xxi",
    name: "AEON Mall Sentul City XXI",
    brand: "IMAX",
    city: "Bogor",
    address: "AEON Mall Sentul City Lt. 3, Jl. MH. Thamrin, Babakan Madang, Kab. Bogor",
    phone: "(021) 2916-8521",
    operatingHours: "10:00 - 23:30 WIB",
    facilities: ["IMAX", "The Premiere", "Dolby Atmos", "XXI Cafe", "Family Lounge"],
    studioTypes: "Regular 2D, IMAX 2D, The Premiere",
    totalStudios: 8,
    ticketBaseInfo: "Senin–Kamis Rp 40.000 | Jumat Rp 45.000 | Sabtu–Minggu Rp 55.000",
    mapUrl: "https://maps.google.com/?q=AEON+Mall+Sentul+City+XXI",
    baseRegPrice: 40000,
    hasImax: true,
    hasPremiere: true,
  },

  // DEPOK
  {
    slug: "margo-city-xxi",
    name: "Margo City XXI",
    brand: "IMAX",
    city: "Depok",
    address: "Margo City Lt. 3, Jl. Margonda Raya No.358, Beji, Kota Depok",
    phone: "(021) 7887-0821",
    operatingHours: "10:00 - 23:30 WIB",
    facilities: ["IMAX", "The Premiere", "Dolby Atmos", "XXI Cafe", "Musholla"],
    studioTypes: "Regular 2D, IMAX 2D, The Premiere",
    totalStudios: 8,
    ticketBaseInfo: "Senin–Kamis Rp 40.000 | Jumat Rp 45.000 | Sabtu–Minggu Rp 55.000",
    mapUrl: "https://maps.google.com/?q=Margo+City+XXI+Depok",
    baseRegPrice: 40000,
    hasImax: true,
    hasPremiere: true,
  },
  {
    slug: "pesona-square-xxi",
    name: "Pesona Square XXI",
    brand: "THE PREMIERE",
    city: "Depok",
    address: "Pesona Square Mall Lt. 2, Jl. Ir. H. Juanda No.99, Sukmajaya, Kota Depok",
    phone: "(021) 2762-1921",
    operatingHours: "10:30 - 23:15 WIB",
    facilities: ["The Premiere", "Dolby 7.1 Surround", "XXI Cafe", "Self-Ticketing"],
    studioTypes: "Regular 2D, The Premiere",
    totalStudios: 6,
    ticketBaseInfo: "Senin–Kamis Rp 35.000 | Jumat Rp 40.000 | Sabtu–Minggu Rp 50.000",
    mapUrl: "https://maps.google.com/?q=Pesona+Square+XXI+Depok",
    baseRegPrice: 35000,
    hasImax: false,
    hasPremiere: true,
  },
  {
    slug: "depok-mall-cgv",
    name: "CGV Depok Mall",
    brand: "CGV",
    city: "Depok",
    address: "Depok Mall Lt. 3, Jl. Margonda Raya Kav. 88, Kemiri Muka, Kota Depok",
    phone: "(021) 7721-4521",
    operatingHours: "10:30 - 23:00 WIB",
    facilities: ["Sweetbox", "Dolby Surround", "CGV Kitchen", "Self-Ticketing"],
    studioTypes: "Regular 2D, Sweetbox",
    totalStudios: 7,
    ticketBaseInfo: "Senin–Kamis Rp 35.000 | Jumat Rp 40.000 | Sabtu–Minggu Rp 50.000",
    mapUrl: "https://maps.google.com/?q=CGV+Depok+Mall",
    baseRegPrice: 35000,
    hasImax: false,
    hasPremiere: false,
  },

  // TANGERANG
  {
    slug: "aeon-bsd-city-xxi",
    name: "AEON Mall BSD City XXI",
    brand: "THE PREMIERE",
    city: "Tangerang",
    address: "AEON Mall BSD City Lt. 3, Jl. BSD Raya Utama, Pagedangan, Tangerang",
    phone: "(021) 2916-8221",
    operatingHours: "10:00 - 23:45 WIB",
    facilities: ["The Premiere", "Dolby Atmos", "XXI Cafe", "Musholla", "Wheelchair Access"],
    studioTypes: "Regular 2D, The Premiere",
    totalStudios: 9,
    ticketBaseInfo: "Senin–Kamis Rp 45.000 | Jumat Rp 50.000 | Sabtu–Minggu Rp 60.000",
    mapUrl: "https://maps.google.com/?q=AEON+Mall+BSD+City+XXI",
    baseRegPrice: 45000,
    hasImax: false,
    hasPremiere: true,
  },
  {
    slug: "summarecon-mall-serpong-xxi",
    name: "Summarecon Mall Serpong XXI",
    brand: "IMAX",
    city: "Tangerang",
    address: "Summarecon Mall Serpong 2 Lt. 3, Jl. Boulevard Gading Serpong, Tangerang",
    phone: "(021) 546-2121",
    operatingHours: "10:00 - 23:45 WIB",
    facilities: ["IMAX", "The Premiere", "Dolby Atmos", "XXI Cafe", "Musholla"],
    studioTypes: "Regular 2D, IMAX 2D, The Premiere",
    totalStudios: 9,
    ticketBaseInfo: "Senin–Kamis Rp 45.000 | Jumat Rp 50.000 | Sabtu–Minggu Rp 60.000",
    mapUrl: "https://maps.google.com/?q=Summarecon+Mall+Serpong+XXI",
    baseRegPrice: 45000,
    hasImax: true,
    hasPremiere: true,
  },
  {
    slug: "teras-kota-cgv",
    name: "CGV Teras Kota",
    brand: "CGV",
    city: "Tangerang",
    address: "Teras Kota Entertainment Center Lt. 2, BSD City, Tangerang Selatan",
    phone: "(021) 2991-5721",
    operatingHours: "10:30 - 23:15 WIB",
    facilities: ["Velvet Class", "Sweetbox", "Dolby Atmos", "Self-Ticketing"],
    studioTypes: "Regular 2D, Velvet Class",
    totalStudios: 8,
    ticketBaseInfo: "Senin–Kamis Rp 40.000 | Jumat Rp 45.000 | Sabtu–Minggu Rp 55.000",
    mapUrl: "https://maps.google.com/?q=CGV+Teras+Kota+BSD",
    baseRegPrice: 40000,
    hasImax: false,
    hasPremiere: true,
  },

  // BEKASI
  {
    slug: "summarecon-mall-bekasi-xxi",
    name: "Summarecon Mall Bekasi XXI",
    brand: "IMAX",
    city: "Bekasi",
    address: "Summarecon Mall Bekasi Lt. 3, Jl. Boulevard Ahmad Yani, Kota Bekasi",
    phone: "(021) 2957-2421",
    operatingHours: "10:00 - 23:45 WIB",
    facilities: ["IMAX", "The Premiere", "Dolby Atmos", "XXI Cafe", "Musholla"],
    studioTypes: "Regular 2D, IMAX 2D, The Premiere",
    totalStudios: 9,
    ticketBaseInfo: "Senin–Kamis Rp 40.000 | Jumat Rp 45.000 | Sabtu–Minggu Rp 55.000",
    mapUrl: "https://maps.google.com/?q=Summarecon+Mall+Bekasi+XXI",
    baseRegPrice: 40000,
    hasImax: true,
    hasPremiere: true,
  },
  {
    slug: "grand-metropolitan-xxi",
    name: "Grand Metropolitan XXI",
    brand: "THE PREMIERE",
    city: "Bekasi",
    address: "Grand Metropolitan Mall Lt. 3, Jl. KH. Noer Ali, Pekayon Jaya, Kota Bekasi",
    phone: "(021) 2947-5121",
    operatingHours: "10:30 - 23:30 WIB",
    facilities: ["The Premiere", "Dolby 7.1 Surround", "XXI Cafe", "Musholla"],
    studioTypes: "Regular 2D, The Premiere",
    totalStudios: 7,
    ticketBaseInfo: "Senin–Kamis Rp 40.000 | Jumat Rp 45.000 | Sabtu–Minggu Rp 55.000",
    mapUrl: "https://maps.google.com/?q=Grand+Metropolitan+XXI+Bekasi",
    baseRegPrice: 40000,
    hasImax: false,
    hasPremiere: true,
  },
];

const moviesData = [
  {
    slug: "resident-evil",
    title: "Resident Evil",
    genre: "Action, Horror, Sci-Fi",
    durationMin: 118,
    rating: "D17+",
    releaseDate: "2026-11-20",
    posterUrl: "/img/Resident_Evil.webp",
    synopsis:
      "Kebocoran virus mematikan di fasilitas bawah tanah Umbrella memicu wabah mengerikan yang mengancam seluruh kota Raccoon.",
  },
  {
    slug: "forgotten-island",
    title: "Forgotten Island",
    genre: "Comedy, Adventure, Family",
    durationMin: 106,
    rating: "SU",
    releaseDate: "2026-11-22",
    posterUrl: "/img/Forgotten_Island.webp",
    synopsis:
      "Ekspedisi keluarga ke pulau tropis terpencil berubah menjadi petualangan kocak penuh teka-teki kuno.",
  },
  {
    slug: "fall-2-deadpoint",
    title: "Fall 2: Deadpoint",
    genre: "Thriller, Survival",
    durationMin: 112,
    rating: "R13+",
    releaseDate: "2026-11-25",
    posterUrl: "/img/Fall_2.webp",
    synopsis:
      "Dua pendaki ekstrem terjebak di puncak tebing kaca tertinggi di dunia saat badai besar tiba-tiba melanda.",
  },
  {
    slug: "digger",
    title: "Digger",
    genre: "Comedy, Drama",
    durationMin: 124,
    rating: "R13+",
    releaseDate: "2026-11-27",
    posterUrl: "/img/Digger.webp",
    synopsis:
      "Kisah hangat tentang seorang penggali terowongan kota yang menemukan rahasia masa lalu di balik proyek bawah tanah.",
  },
];

function getNext7Days(): string[] {
  const dates: string[] = [];
  const start = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
}

function getDaySurcharge(dateStr: string): number {
  const day = new Date(`${dateStr}T00:00:00`).getDay();
  if (day === 0 || day === 6) return 15000;
  if (day === 5) return 5000;
  return 0;
}

async function main() {
  console.log("Seeding 16 Jabodetabek cinemas & 7-day schedules...");

  await prisma.bookedSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.cinema.deleteMany();
  await prisma.movie.deleteMany();

  const movieMap: Record<string, { id: string; title: string; rating: string }> = {};
  for (const m of moviesData) {
    const created = await prisma.movie.create({ data: m });
    movieMap[m.slug] = { id: created.id, title: created.title, rating: created.rating };
  }

  const dates = getNext7Days();

  for (const c of cinemasData) {
    const cinema = await prisma.cinema.create({
      data: {
        slug: c.slug,
        name: c.name,
        brand: c.brand,
        city: c.city,
        address: c.address,
        phone: c.phone,
        operatingHours: c.operatingHours,
        facilities: JSON.stringify(c.facilities),
        studioTypes: c.studioTypes,
        totalStudios: c.totalStudios,
        ticketBaseInfo: c.ticketBaseInfo,
        mapUrl: c.mapUrl,
      },
    });

    for (let dIdx = 0; dIdx < dates.length; dIdx++) {
      const showDate = dates[dIdx];
      const surcharge = getDaySurcharge(showDate);

      const re = movieMap["resident-evil"];
      const reSlots = [
        { studio: "Studio 1", studioType: "REGULAR", showTime: "13:15", price: c.baseRegPrice + surcharge },
        { studio: "Studio 1", studioType: "REGULAR", showTime: "16:00", price: c.baseRegPrice + surcharge },
        { studio: "Studio 2", studioType: "REGULAR", showTime: "19:15", price: c.baseRegPrice + surcharge },
        { studio: "Studio 2", studioType: "REGULAR", showTime: "21:45", price: c.baseRegPrice + surcharge },
      ];
      if (c.hasImax) {
        reSlots.push(
          { studio: "IMAX 1", studioType: "IMAX", showTime: "14:30", price: c.baseRegPrice + 25000 + surcharge },
          { studio: "IMAX 1", studioType: "IMAX", showTime: "20:15", price: c.baseRegPrice + 25000 + surcharge }
        );
      }

      for (const s of reSlots) {
        await prisma.showtime.create({
          data: {
            movieTitle: re.title,
            rating: re.rating,
            cinema: cinema.name,
            cinemaId: cinema.id,
            movieId: re.id,
            studio: s.studio,
            studioType: s.studioType,
            showDate,
            showTime: s.showTime,
            ticketPrice: s.price,
            adminFee: 4000,
            totalSeats: 48,
          },
        });
      }

      const digger = movieMap["digger"];
      const diggerSlots = [
        { studio: "Studio 3", studioType: "REGULAR", showTime: "14:00", price: c.baseRegPrice + surcharge },
        { studio: "Studio 3", studioType: "REGULAR", showTime: "18:30", price: c.baseRegPrice + surcharge },
      ];
      if (c.hasPremiere) {
        diggerSlots.push(
          { studio: "Premiere 1", studioType: "PREMIERE", showTime: "15:30", price: c.baseRegPrice + 65000 + surcharge },
          { studio: "Premiere 1", studioType: "PREMIERE", showTime: "20:45", price: c.baseRegPrice + 65000 + surcharge }
        );
      }

      for (const s of diggerSlots) {
        await prisma.showtime.create({
          data: {
            movieTitle: digger.title,
            rating: digger.rating,
            cinema: cinema.name,
            cinemaId: cinema.id,
            movieId: digger.id,
            studio: s.studio,
            studioType: s.studioType,
            showDate,
            showTime: s.showTime,
            ticketPrice: s.price,
            adminFee: 4000,
            totalSeats: s.studioType === "PREMIERE" ? 24 : 48,
          },
        });
      }

      const extraMovie = dIdx % 2 === 0 ? movieMap["forgotten-island"] : movieMap["fall-2-deadpoint"];
      for (const time of ["12:45", "17:15", "20:00"]) {
        await prisma.showtime.create({
          data: {
            movieTitle: extraMovie.title,
            rating: extraMovie.rating,
            cinema: cinema.name,
            cinemaId: cinema.id,
            movieId: extraMovie.id,
            studio: "Studio 4",
            studioType: "REGULAR",
            showDate,
            showTime: time,
            ticketPrice: c.baseRegPrice + surcharge,
            adminFee: 4000,
            totalSeats: 48,
          },
        });
      }
    }
  }

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });