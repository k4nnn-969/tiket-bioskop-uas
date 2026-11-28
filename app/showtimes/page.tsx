"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface ShowtimeSlot {
  id: string;
  studio: string;
  studioType: string;
  showTime: string;
  ticketPrice: number;
  availableSeats: number;
  totalSeats: number;
}

interface CinemaMovieItem {
  movieTitle: string;
  movieSlug: string;
  rating: string;
  posterUrl: string;
  durationMin: number;
  slots: ShowtimeSlot[];
}

interface CinemaScheduleGroup {
  cinemaSlug: string;
  cinemaName: string;
  city: string;
  brand: string;
  address: string;
  movies: CinemaMovieItem[];
}

export default function ShowtimesPage() {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [activeDate, setActiveDate] = useState("");
  const [moviesFilter, setMoviesFilter] = useState<
    Array<{ slug: string; title: string }>
  >([]);
  const [selectedMovie, setSelectedMovie] = useState("ALL");
  const [selectedStudioType, setSelectedStudioType] = useState("ALL");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [results, setResults] = useState<CinemaScheduleGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShowtimes() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeDate) params.set("date", activeDate);
        if (selectedMovie !== "ALL") params.set("movie", selectedMovie);
        if (selectedStudioType !== "ALL")
          params.set("studioType", selectedStudioType);
        if (selectedCity !== "ALL") params.set("city", selectedCity);

        const res = await fetch(`/api/showtimes?${params.toString()}`);
        const data = await res.json();

        setAvailableDates(data.availableDates || []);
        if (!activeDate && data.activeDate) {
          setActiveDate(data.activeDate);
        }
        setMoviesFilter(data.moviesFilter || []);
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadShowtimes();
  }, [activeDate, selectedMovie, selectedStudioType, selectedCity]);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-slate-900">

      <SiteHeader />

      <section className="bg-[#0B192C] text-white py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                JADWAL TAYANG REAL-TIME
              </span>
              <h1 className="text-3xl font-extrabold mt-1">
                Showtimes Lintas Bioskop Jakarta
              </h1>
              <p className="text-slate-300 text-sm mt-1">
                Bandingkan jam tayang, harga tiket, dan sisa kursi di seluruh cabang XXI Jakarta.
              </p>
            </div>
            <Link
              href="/cinemas"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0B192C] text-xs font-extrabold transition"
            >
              Lihat Daftar Bioskop →
            </Link>
          </div>

          <div className="mt-6 bg-white text-slate-900 p-4 rounded-2xl shadow-md flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {availableDates.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDate(d)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeDate === d
                      ? "bg-[#1A56DB] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <select
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <option value="ALL">Semua Film</option>
              {moviesFilter.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.title}
                </option>
              ))}
            </select>

            <select
              value={selectedStudioType}
              onChange={(e) => setSelectedStudioType(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <option value="ALL">Semua Kelas Studio</option>
              <option value="REGULAR">Regular 2D</option>
              <option value="IMAX">IMAX</option>
              <option value="PREMIERE">The Premiere</option>
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <option value="ALL">Semua Wilayah Jakarta</option>
              <option value="Jakarta Pusat">Jakarta Pusat</option>
              <option value="Jakarta Selatan">Jakarta Selatan</option>
              <option value="Jakarta Barat">Jakarta Barat</option>
              <option value="Jakarta Utara">Jakarta Utara</option>
              <option value="Jakarta Timur">Jakarta Timur</option>
            </select>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-5">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-white border border-slate-200 animate-pulse" />
          ))
        ) : results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
            Tidak ada jadwal tayang sesuai filter yang dipilih.
          </div>
        ) : (
          results.map((cinema) => (
            <div
              key={cinema.cinemaSlug}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/cinemas/${cinema.cinemaSlug}`}
                      className="text-lg font-extrabold text-[#0B192C] hover:text-[#1A56DB] transition"
                    >
                      {cinema.cinemaName}
                    </Link>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1A56DB]">
                      {cinema.city}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{cinema.address}</p>
                </div>

                <Link
                  href={`/cinemas/${cinema.cinemaSlug}`}
                  className="text-xs font-bold text-[#1A56DB] hover:underline"
                >
                  Lihat Detail Bioskop →
                </Link>
              </div>

              <div className="mt-5 space-y-5">
                {cinema.movies.map((movie) => (
                  <div key={movie.movieSlug} className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={movie.posterUrl}
                      alt={movie.movieTitle}
                      className="w-20 h-28 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#0B192C]">
                          {movie.movieTitle}
                        </h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                          {movie.rating}
                        </span>
                        <span className="text-xs text-slate-400">
                          {movie.durationMin} mnt
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {movie.slots.map((slot) => (
                          <Link
                            key={slot.id}
                            href={`/booking?showtimeId=${slot.id}`}
                            className="group px-4 py-2 rounded-xl bg-white hover:bg-[#1A56DB] border border-slate-200 hover:border-[#1A56DB] transition min-w-[125px]"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-extrabold text-sm text-[#0B192C] group-hover:text-white">
                                {slot.showTime}
                              </span>
                              <span className="text-[10px] font-bold text-[#1A56DB] group-hover:text-amber-300">
                                {slot.studioType}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 group-hover:text-blue-100 mt-0.5">
                              {formatRupiah(slot.ticketPrice)} • {slot.availableSeats} kursi
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      <SiteFooter />
    </div>
  );
}