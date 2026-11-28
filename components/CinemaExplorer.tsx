"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface CinemaItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  city: string;
  address: string;
  phone: string;
  operatingHours: string;
  facilities: string[];
  studioTypes: string;
  totalStudios: number;
  ticketBaseInfo: string;
  mapUrl?: string;
  activeShowtimesCount: number;
}

interface ScheduleSlot {
  id: string;
  studio: string;
  studioType: string;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  adminFee: number;
  totalSeats: number;
  bookedCount: number;
  availableSeats: number;
}

interface MovieScheduleGroup {
  movieId: string | null;
  title: string;
  slug: string;
  genre: string;
  durationMin: number;
  rating: string;
  posterUrl: string;
  synopsis: string;
  schedules: ScheduleSlot[];
}

const REGION_MAP: Record<string, string[]> = {
  "DKI Jakarta": [
    "Jakarta Pusat",
    "Jakarta Selatan",
    "Jakarta Barat",
    "Jakarta Utara",
    "Jakarta Timur",
  ],
  "Jawa Barat": ["Bogor", "Depok", "Bekasi"],
  Banten: ["Tangerang"],
};

const FACILITY_OPTIONS = [
  "Dolby Atmos",
  "IMAX",
  "The Premiere",
  "XXI Cafe",
  "Musholla",
];

function inferKabKota(item: CinemaItem): string {
  const addr = item.address.toLowerCase();
  if (addr.includes("jakarta pusat")) return "Jakarta Pusat";
  if (addr.includes("jakarta selatan")) return "Jakarta Selatan";
  if (addr.includes("jakarta barat")) return "Jakarta Barat";
  if (addr.includes("jakarta utara")) return "Jakarta Utara";
  if (addr.includes("jakarta timur")) return "Jakarta Timur";
  return item.city;
}

function inferProvince(item: CinemaItem): string {
  const kab = inferKabKota(item);
  if (kab.startsWith("Jakarta")) return "DKI Jakarta";
  if (kab === "Tangerang") return "Banten";
  return "Jawa Barat";
}

export default function CinemaExplorer({
  initialSlug,
}: {
  initialSlug?: string;
}) {
  const [cinemas, setCinemas] = useState<CinemaItem[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("ALL");
  const [selectedKabKota, setSelectedKabKota] = useState("ALL");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"RECOMMENDED" | "STUDIOS" | "NAME">(
    "RECOMMENDED"
  );
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("ALL");
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>(initialSlug || "");

  const [detailCinema, setDetailCinema] = useState<CinemaItem | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [activeDate, setActiveDate] = useState<string>("");
  const [movies, setMovies] = useState<MovieScheduleGroup[]>([]);
  const [selectedMovieDetail, setSelectedMovieDetail] =
    useState<MovieScheduleGroup | null>(null);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tixid_favorite_cinemas");
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug];
      try {
        localStorage.setItem("tixid_favorite_cinemas", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const toggleFacilityCheck = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((item) => item !== facility)
        : [...prev, facility]
    );
  };

  useEffect(() => {
    async function fetchCinemas() {
      setLoadingList(true);
      try {
        const res = await fetch("/api/cinemas");
        const data = await res.json();
        const list: CinemaItem[] = data.cinemas || [];
        setCinemas(list);

        if (!initialSlug && list.length > 0 && !activeSlug) {
          setActiveSlug(list[0].slug);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingList(false);
      }
    }
    fetchCinemas();
  }, [initialSlug]);

  const availableKabKotaOptions = useMemo(() => {
    if (selectedProvince !== "ALL") {
      return REGION_MAP[selectedProvince] || [];
    }
    return Object.values(REGION_MAP).flat();
  }, [selectedProvince]);

  const filteredCinemas = useMemo(() => {
    return cinemas
      .filter((c) => {
        const prov = inferProvince(c);
        const kab = inferKabKota(c);

        if (selectedProvince !== "ALL" && prov !== selectedProvince) {
          return false;
        }
        if (selectedKabKota !== "ALL" && kab !== selectedKabKota) {
          return false;
        }
        if (selectedBrand !== "ALL" && c.brand !== selectedBrand) return false;

        if (selectedFacilities.length > 0) {
          const hasAllChecked = selectedFacilities.every((fac) =>
            c.facilities.some((item) =>
              item.toLowerCase().includes(fac.toLowerCase())
            )
          );
          if (!hasAllChecked) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            c.name.toLowerCase().includes(q) ||
            c.address.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q) ||
            kab.toLowerCase().includes(q) ||
            prov.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const aFav = favorites.includes(a.slug) ? 1 : 0;
        const bFav = favorites.includes(b.slug) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;
        if (sortBy === "STUDIOS") return b.totalStudios - a.totalStudios;
        if (sortBy === "NAME") return a.name.localeCompare(b.name);
        return b.activeShowtimesCount - a.activeShowtimesCount;
      });
  }, [
    cinemas,
    selectedProvince,
    selectedKabKota,
    selectedBrand,
    selectedFacilities,
    sortBy,
    searchQuery,
    favorites,
  ]);

  useEffect(() => {
    if (!activeSlug) return;
    async function fetchCinemaDetail() {
      setLoadingDetail(true);
      try {
        const query = activeDate ? `?date=${encodeURIComponent(activeDate)}` : "";
        const res = await fetch(`/api/cinemas/${activeSlug}${query}`);
        if (!res.ok) {
          setDetailCinema(null);
          return;
        }
        const data = await res.json();
        setDetailCinema(data.cinema);
        setAvailableDates(data.availableDates || []);
        if (data.activeDate && data.activeDate !== activeDate) {
          setActiveDate(data.activeDate);
        }
        setMovies(data.movies || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetail(false);
      }
    }
    fetchCinemaDetail();
  }, [activeSlug, activeDate]);

  const handleSelectCinema = (slug: string) => {
    setActiveSlug(slug);
    setActiveDate("");
    window.history.replaceState(null, "", `/cinemas/${slug}`);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  const checkIsWeekend = (dateStr: string) => {
    if (!dateStr) return false;
    const day = new Date(`${dateStr}T00:00:00`).getDay();
    return day === 0 || day === 6;
  };

  const formatDateCard = (dateStr: string, idx: number) => {
    const parsed = new Date(`${dateStr}T00:00:00`);
    if (isNaN(parsed.getTime())) {
      return {
        top: idx === 0 ? "Hari Ini" : "Jadwal",
        day: dateStr,
        month: "",
        isWeekend: false,
      };
    }
    const dayIdx = parsed.getDay();
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];
    return {
      top: idx === 0 ? "Hari Ini" : days[dayIdx],
      day: String(parsed.getDate()),
      month: months[parsed.getMonth()],
      isWeekend: dayIdx === 0 || dayIdx === 6,
    };
  };

  const filterSlotsByTime = (slots: ScheduleSlot[]) => {
    if (selectedTimePeriod === "ALL") return slots;
    return slots.filter((s) => {
      const hour = parseInt(s.showTime.split(":")[0], 10);
      if (selectedTimePeriod === "AFTERNOON") return hour < 15;
      if (selectedTimePeriod === "EVENING") return hour >= 15 && hour <= 18;
      if (selectedTimePeriod === "NIGHT") return hour > 18;
      return true;
    });
  };

  const resetAllFilters = () => {
    setSelectedProvince("ALL");
    setSelectedKabKota("ALL");
    setSelectedBrand("ALL");
    setSelectedFacilities([]);
    setSearchQuery("");
  };

  const isWeekendActive = checkIsWeekend(activeDate);
  const activeFilterCount =
    (selectedProvince !== "ALL" ? 1 : 0) +
    (selectedKabKota !== "ALL" ? 1 : 0) +
    (selectedBrand !== "ALL" ? 1 : 0) +
    selectedFacilities.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-slate-900">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-7">

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 mb-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A56DB] bg-blue-50 px-3 py-1 rounded-full">
                  🗺️ Filter Provinsi &amp; Kota/Kabupaten
                </span>
                <span className="text-xs text-slate-400">
                  {cinemas.length} lokasi bioskop terdaftar
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B192C] mt-1.5">
                Jelajahi Bioskop &amp; Jadwal Tayang
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/70">
              {["ALL", ...Object.keys(REGION_MAP)].map((prov) => {
                const active = selectedProvince === prov;
                return (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => {
                      setSelectedProvince(prov);
                      setSelectedKabKota("ALL");
                    }}
                    style={
                      active
                        ? { backgroundColor: "#0B192C", color: "#ffffff" }
                        : undefined
                    }
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                      active
                        ? "!text-white shadow-xs"
                        : "text-slate-600 hover:text-[#0B192C] hover:bg-white/70"
                    }`}
                  >
                    {prov === "ALL" ? "Semua Provinsi" : prov}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1">
              Kota / Kabupaten:
            </span>
            <button
              type="button"
              onClick={() => setSelectedKabKota("ALL")}
              style={
                selectedKabKota === "ALL"
                  ? { backgroundColor: "#1A56DB", color: "#ffffff" }
                  : undefined
              }
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                selectedKabKota === "ALL"
                  ? "!text-white"
                  : "bg-slate-50 border border-slate-200 text-slate-600 hover:border-[#1A56DB]"
              }`}
            >
              Semua Kota/Kab
            </button>
            {availableKabKotaOptions.map((kab) => {
              const active = selectedKabKota === kab;
              return (
                <button
                  key={kab}
                  type="button"
                  onClick={() => setSelectedKabKota(kab)}
                  style={
                    active
                      ? { backgroundColor: "#1A56DB", color: "#ffffff" }
                      : undefined
                  }
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    active
                      ? "!text-white"
                      : "bg-slate-50 border border-slate-200 text-slate-600 hover:border-[#1A56DB]"
                  }`}
                >
                  {kab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <aside className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 lg:sticky lg:top-20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#0B192C]">
                  Pilih Bioskop
                </h2>
                <p className="text-xs text-slate-500">
                  Menampilkan {filteredCinemas.length} cabang
                </p>
              </div>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[11px] font-semibold text-rose-600 hover:underline"
                  >
                    Reset ({activeFilterCount})
                  </button>
                )}
                <Link
                  href="/showtimes"
                  className="text-xs font-semibold text-[#1A56DB] hover:underline"
                >
                  Lintas Bioskop →
                </Link>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama mal, kota, atau provinsi..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1A56DB] focus:bg-white transition"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
                🔍
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                Tipe Studio &amp; Jaringan
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "ALL", label: "Semua" },
                  { id: "XXI", label: "XXI" },
                  { id: "IMAX", label: "IMAX" },
                  { id: "THE PREMIERE", label: "Premiere" },
                  { id: "CGV", label: "CGV" },
                ].map((b) => {
                  const active = selectedBrand === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBrand(b.id)}
                      style={
                        active
                          ? { backgroundColor: "#1A56DB", color: "#ffffff" }
                          : undefined
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        active
                          ? "!text-white shadow-2xs"
                          : "bg-slate-50 border border-slate-200 text-slate-700 hover:border-[#1A56DB]"
                      }`}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Ceklis Fasilitas Bioskop
                </label>
                {selectedFacilities.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedFacilities([])}
                    className="text-[10px] font-semibold text-[#1A56DB] hover:underline"
                  >
                    Hapus ceklis
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FACILITY_OPTIONS.map((fac) => {
                  const checked = selectedFacilities.includes(fac);
                  return (
                    <button
                      key={fac}
                      type="button"
                      onClick={() => toggleFacilityCheck(fac)}
                      style={
                        checked
                          ? {
                              backgroundColor: "#EFF6FF",
                              borderColor: "#1A56DB",
                              color: "#1E40AF",
                            }
                          : undefined
                      }
                      className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                        checked
                          ? "shadow-2xs"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span
                        style={
                          checked
                            ? { backgroundColor: "#1A56DB", color: "#ffffff" }
                            : undefined
                        }
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${
                          checked
                            ? "border-[#1A56DB] !text-white"
                            : "border-slate-300 bg-slate-50 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <span>{fac}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-1">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Urutkan Daftar Bioskop
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "RECOMMENDED" | "STUDIOS" | "NAME"
                  )
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#1A56DB]"
              >
                <option value="RECOMMENDED">Rekomendasi &amp; Jadwal Terbanyak</option>
                <option value="STUDIOS">Studio Terbanyak</option>
                <option value="NAME">Nama Bioskop (A–Z)</option>
              </select>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 pt-2 border-t border-slate-100">
              {loadingList ? (
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl bg-slate-100 animate-pulse"
                  />
                ))
              ) : filteredCinemas.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-xs text-slate-500">
                    Tidak ada bioskop yang cocok dengan filter ini.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs font-semibold text-[#1A56DB] hover:underline"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : (
                filteredCinemas.map((cinema) => {
                  const isSelected = cinema.slug === activeSlug;
                  const isFav = favorites.includes(cinema.slug);
                  const kabLabel = inferKabKota(cinema);
                  return (
                    <div
                      key={cinema.id}
                      onClick={() => handleSelectCinema(cinema.slug)}
                      className={`cursor-pointer rounded-xl p-3.5 border transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-blue-50/80 border-[#1A56DB] ring-1 ring-[#1A56DB]/20"
                          : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(cinema.slug);
                          }}
                          title="Tandai Favorit"
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border shrink-0 transition ${
                            isFav
                              ? "bg-amber-400 border-amber-400 text-[#0B192C]"
                              : "bg-white border-slate-200 text-slate-300 hover:text-amber-400"
                          }`}
                        >
                          ★
                        </button>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-[#0B192C] truncate">
                            {cinema.name}
                          </h3>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {kabLabel} • {cinema.totalStudios} Studio
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {cinema.brand === "THE PREMIERE"
                            ? "Premiere"
                            : cinema.brand}
                        </span>
                        <div className="text-[11px] font-semibold text-[#1A56DB] mt-0.5">
                          {cinema.activeShowtimesCount} jadwal
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-5">
            {loadingDetail && !detailCinema ? (
              <div className="h-96 rounded-2xl bg-white border border-slate-200 animate-pulse" />
            ) : !detailCinema ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-600 font-medium">
                  Pilih salah satu bioskop di sebelah kiri untuk melihat jadwal tayang.
                </p>
              </div>
            ) : (
              <>

                <div className="rounded-2xl bg-gradient-to-r from-[#0B192C] via-[#13294B] to-[#1E3A5F] text-white p-6 sm:p-7 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          style={{ backgroundColor: "#1A56DB", color: "#ffffff" }}
                          className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold"
                        >
                          {inferProvince(detailCinema)} •{" "}
                          {detailCinema.brand === "THE PREMIERE"
                            ? "The Premiere"
                            : detailCinema.brand}
                        </span>
                        <span className="text-xs text-slate-300">
                          {detailCinema.totalStudios} Studio Tersedia
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        {detailCinema.name}
                      </h2>
                      <p className="text-slate-300 text-xs sm:text-sm mt-1.5">
                        {detailCinema.address}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {detailCinema.facilities.map((fac) => (
                          <span
                            key={fac}
                            className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-slate-100"
                          >
                            ✓ {fac}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleShare}
                        style={{ color: "#ffffff" }}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold transition"
                      >
                        {copiedToast ? "✓ Link Tersalin" : "🔗 Bagikan"}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(detailCinema.slug)}
                        style={{ backgroundColor: "#FACC15", color: "#0B192C" }}
                        className="px-4 py-2 rounded-xl text-xs font-extrabold transition hover:opacity-95"
                      >
                        {favorites.includes(detailCinema.slug)
                          ? "★ Difavoritkan"
                          : "★ Favorit"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                    <div className="flex flex-wrap items-center gap-4">
                      <span>🕒 {detailCinema.operatingHours}</span>
                      <span>📞 {detailCinema.phone}</span>
                      <span className="text-amber-300 font-medium">
                        🎟️ {detailCinema.ticketBaseInfo}
                      </span>
                    </div>
                    {detailCinema.mapUrl && (
                      <a
                        href={detailCinema.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#FCD34D" }}
                        className="hover:underline font-semibold"
                      >
                        Buka Google Maps ↗
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600">
                      Pilih Tanggal Tayang (7 Hari ke Depan)
                    </span>
                    {isWeekendActive ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        ⚡ Tarif Weekend (Sabtu–Minggu) Aktif
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        ✓ Tarif Normal Weekday
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {availableDates.map((dateStr, idx) => {
                      const formatted = formatDateCard(dateStr, idx);
                      const isActive = activeDate === dateStr;
                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => setActiveDate(dateStr)}
                          style={
                            isActive
                              ? {
                                  backgroundColor: "#1A56DB",
                                  borderColor: "#1A56DB",
                                  color: "#ffffff",
                                }
                              : undefined
                          }
                          className={`py-2.5 px-2 rounded-xl border text-center transition ${
                            isActive
                              ? "!text-white shadow-xs"
                              : formatted.isWeekend
                              ? "bg-amber-50/70 border-amber-200 text-slate-800 hover:border-amber-400"
                              : "bg-white border-slate-200 text-slate-700 hover:border-[#1A56DB]"
                          }`}
                        >
                          <div
                            style={isActive ? { color: "#DBEAFE" } : undefined}
                            className={`text-[11px] font-bold ${
                              isActive
                                ? ""
                                : formatted.isWeekend
                                ? "text-amber-700"
                                : "text-slate-400"
                            }`}
                          >
                            {formatted.top}
                          </div>
                          <div className="text-lg font-extrabold leading-tight mt-0.5">
                            {formatted.day}
                          </div>
                          <div
                            style={isActive ? { color: "#DBEAFE" } : undefined}
                            className={`text-[11px] font-medium ${
                              isActive ? "" : "text-slate-500"
                            }`}
                          >
                            {formatted.month}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { id: "ALL", label: "Semua Jam" },
                        { id: "AFTERNOON", label: "Siang (<15:00)" },
                        { id: "EVENING", label: "Sore (15–18)" },
                        { id: "NIGHT", label: "Malam (>18:00)" },
                      ].map((t) => {
                        const active = selectedTimePeriod === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTimePeriod(t.id)}
                            style={
                              active
                                ? { backgroundColor: "#0B192C", color: "#ffffff" }
                                : undefined
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              active
                                ? "!text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                      <span className="text-xs font-semibold text-slate-600">
                        Estimasi:
                      </span>
                      {[1, 2, 3, 4].map((num) => {
                        const active = ticketCount === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setTicketCount(num)}
                            style={
                              active
                                ? { backgroundColor: "#1A56DB", color: "#ffffff" }
                                : undefined
                            }
                            className={`w-6 h-6 rounded-md text-xs font-bold transition ${
                              active
                                ? "!text-white"
                                : "bg-white border border-slate-200 text-slate-700 hover:border-[#1A56DB]"
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                      <span className="text-[11px] text-slate-500">Tiket</span>
                    </div>
                  </div>
                </div>

                {showPromoBanner && (
                  <div
                    style={{
                      backgroundColor: isWeekendActive ? "#D97706" : "#059669",
                      color: "#ffffff",
                    }}
                    className="rounded-xl px-5 py-3.5 flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-base shrink-0">
                        {isWeekendActive ? "✨" : "💳"}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {isWeekendActive
                            ? "Tarif Akhir Pekan (Sabtu–Minggu) Otomatis Diterapkan"
                            : "Harga Hemat Weekday + Estimasi Total Otomatis Aktif!"}
                        </p>
                        <p className="text-xs text-white/90">
                          Ubah jumlah tiket di atas untuk melihat estimasi total harga langsung pada tiap jadwal.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPromoBanner(false)}
                      style={{ color: "#ffffff" }}
                      className="hover:opacity-80 text-sm font-bold px-2"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {movies.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 text-sm">
                    Tidak ada jadwal tayang pada tanggal ini.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {movies.map((movie) => {
                      const timeFilteredSchedules = filterSlotsByTime(
                        movie.schedules
                      );
                      if (timeFilteredSchedules.length === 0) return null;

                      const groupedByStudio: Record<string, ScheduleSlot[]> = {};
                      for (const s of timeFilteredSchedules) {
                        const typeLabel =
                          s.studioType === "PREMIERE"
                            ? "The Premiere"
                            : s.studioType === "IMAX"
                            ? "IMAX 2D"
                            : "Regular 2D";
                        if (!groupedByStudio[typeLabel]) {
                          groupedByStudio[typeLabel] = [];
                        }
                        groupedByStudio[typeLabel].push(s);
                      }

                      return (
                        <div
                          key={movie.slug}
                          className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row gap-5">
                            <button
                              type="button"
                              onClick={() => setSelectedMovieDetail(movie)}
                              className="group relative w-28 h-40 rounded-xl overflow-hidden border border-slate-200 shrink-0 text-left"
                            >
                              <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                              />
                              <span
                                style={{ color: "#ffffff" }}
                                className="absolute inset-x-0 bottom-0 bg-black/75 text-[10px] font-semibold text-center py-1"
                              >
                                Info Film
                              </span>
                            </button>

                            <div className="flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMovieDetail(movie)}
                                    className="text-xl font-bold text-[#0B192C] hover:text-[#1A56DB] transition text-left"
                                  >
                                    {movie.title}
                                  </button>
                                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">
                                      ★ 9.0
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
                                      {movie.rating}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {movie.genre} • {movie.durationMin} Menit
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setSelectedMovieDetail(movie)}
                                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#1A56DB] text-xs font-semibold text-slate-700 hover:text-[#1A56DB] transition"
                                >
                                  Sinopsis &amp; Info
                                </button>
                              </div>

                              <div className="mt-5 space-y-4">
                                {Object.entries(groupedByStudio).map(
                                  ([studioLabel, slots]) => {
                                    const singlePrice = slots[0].ticketPrice;
                                    const estimatedTotal =
                                      singlePrice * ticketCount;
                                    return (
                                      <div
                                        key={studioLabel}
                                        className="pt-3 border-t border-slate-100"
                                      >
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-800">
                                              {studioLabel}
                                            </span>
                                            {isWeekendActive && (
                                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                                Weekend
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <span className="text-xs font-extrabold text-rose-600">
                                              {formatRupiah(singlePrice)}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                              {" "}
                                              / tiket
                                            </span>
                                            {ticketCount > 1 && (
                                              <span className="ml-2 text-[11px] font-bold text-[#1A56DB] bg-blue-50 px-2 py-0.5 rounded">
                                                {ticketCount}x ={" "}
                                                {formatRupiah(estimatedTotal)}
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2.5">
                                          {slots.map((slot) => {
                                            const occupancyPct = Math.round(
                                              ((slot.totalSeats -
                                                slot.availableSeats) /
                                                slot.totalSeats) *
                                                100
                                            );
                                            const isLow =
                                              slot.availableSeats <= 15;
                                            return (
                                              <Link
                                                key={slot.id}
                                                href={`/booking?showtimeId=${slot.id}`}
                                                className="group px-4 py-2.5 rounded-xl bg-white hover:bg-[#1A56DB] border border-slate-200 hover:border-[#1A56DB] text-center transition min-w-[114px] shadow-2xs"
                                              >
                                                <div className="text-sm font-extrabold text-[#0B192C] group-hover:!text-white">
                                                  {slot.showTime}
                                                </div>
                                                <div className="text-[10px] font-medium text-slate-400 group-hover:!text-blue-100">
                                                  {slot.studio}
                                                </div>
                                                <div className="w-full h-1 bg-slate-100 group-hover:bg-blue-400/40 rounded-full overflow-hidden my-1">
                                                  <div
                                                    style={{
                                                      width: `${Math.max(
                                                        12,
                                                        occupancyPct
                                                      )}%`,
                                                    }}
                                                    className={`h-full rounded-full ${
                                                      isLow
                                                        ? "bg-amber-500 group-hover:bg-amber-300"
                                                        : "bg-emerald-500 group-hover:bg-white"
                                                    }`}
                                                  />
                                                </div>
                                                <div
                                                  className={`text-[9px] font-bold ${
                                                    isLow
                                                      ? "text-amber-600 group-hover:!text-amber-200"
                                                      : "text-emerald-600 group-hover:!text-blue-100"
                                                  }`}
                                                >
                                                  Sisa {slot.availableSeats}{" "}
                                                  kursi
                                                </div>
                                              </Link>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {selectedMovieDetail && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedMovieDetail(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMovieDetail(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={selectedMovieDetail.posterUrl}
                alt={selectedMovieDetail.title}
                className="w-28 h-40 object-cover rounded-xl border border-slate-200 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
                    {selectedMovieDetail.rating}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedMovieDetail.durationMin} Menit
                  </span>
                  {isWeekendActive && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      Tarif Weekend
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-[#0B192C]">
                  {selectedMovieDetail.title}
                </h3>
                <p className="text-xs font-semibold text-[#1A56DB] mt-1">
                  {selectedMovieDetail.genre}
                </p>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {selectedMovieDetail.synopsis}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 mb-3">
                Pilih Jam Tayang di {detailCinema?.name} ({ticketCount} Tiket):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {selectedMovieDetail.schedules.map((slot) => (
                  <Link
                    key={slot.id}
                    href={`/booking?showtimeId=${slot.id}`}
                    style={{ backgroundColor: "#1A56DB", color: "#ffffff" }}
                    className="px-3.5 py-2.5 rounded-xl hover:opacity-90 !text-white transition text-left"
                  >
                    <div className="text-sm font-extrabold !text-white">
                      {slot.showTime} • {slot.studioType}
                    </div>
                    <div className="text-[11px] !text-blue-100 mt-0.5">
                      {formatRupiah(slot.ticketPrice * ticketCount)} (
                      {slot.availableSeats} kursi)
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}