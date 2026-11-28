import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || "";
    const movieSlug = searchParams.get("movie") || "";
    const studioType = searchParams.get("studioType") || "";
    const city = searchParams.get("city") || "";

    const allShowtimes = await prisma.showtime.findMany({
      where: {
        cinemaId: { not: null },
      },
      include: {
        cinemaRel: true,
        movieRel: true,
        _count: {
          select: { bookedSeats: true },
        },
      },
      orderBy: [{ showDate: "asc" }, { showTime: "asc" }],
    });

    const availableDates = Array.from(
      new Set(allShowtimes.map((s) => s.showDate))
    ).sort();

    const activeDate =
      date && availableDates.includes(date) ? date : availableDates[0] || "";

    const filtered = allShowtimes.filter((st) => {
      if (activeDate && st.showDate !== activeDate) return false;
      if (movieSlug && movieSlug !== "ALL" && st.movieRel?.slug !== movieSlug)
        return false;
      if (
        studioType &&
        studioType !== "ALL" &&
        st.studioType !== studioType
      )
        return false;
      if (city && city !== "ALL" && st.cinemaRel?.city !== city) return false;
      return true;
    });

    const groupedByCinema = new Map<
      string,
      {
        cinemaSlug: string;
        cinemaName: string;
        city: string;
        brand: string;
        address: string;
        movies: Record<
          string,
          {
            movieTitle: string;
            movieSlug: string;
            rating: string;
            posterUrl: string;
            durationMin: number;
            slots: Array<{
              id: string;
              studio: string;
              studioType: string;
              showTime: string;
              ticketPrice: number;
              availableSeats: number;
              totalSeats: number;
            }>;
          }
        >;
      }
    >();

    for (const st of filtered) {
      if (!st.cinemaRel) continue;
      const cSlug = st.cinemaRel.slug;

      if (!groupedByCinema.has(cSlug)) {
        groupedByCinema.set(cSlug, {
          cinemaSlug: cSlug,
          cinemaName: st.cinemaRel.name,
          city: st.cinemaRel.city,
          brand: st.cinemaRel.brand,
          address: st.cinemaRel.address,
          movies: {},
        });
      }

      const cinemaEntry = groupedByCinema.get(cSlug)!;
      const mSlug = st.movieRel?.slug || st.movieTitle;

      if (!cinemaEntry.movies[mSlug]) {
        cinemaEntry.movies[mSlug] = {
          movieTitle: st.movieRel?.title || st.movieTitle,
          movieSlug: mSlug,
          rating: st.movieRel?.rating || st.rating,
          posterUrl: st.movieRel?.posterUrl || "/img/Resident_Evil.webp",
          durationMin: st.movieRel?.durationMin || 115,
          slots: [],
        };
      }

      cinemaEntry.movies[mSlug].slots.push({
        id: st.id,
        studio: st.studio,
        studioType: st.studioType,
        showTime: st.showTime,
        ticketPrice: st.ticketPrice,
        totalSeats: st.totalSeats,
        availableSeats: Math.max(0, st.totalSeats - st._count.bookedSeats),
      });
    }

    const moviesList = await prisma.movie.findMany({
      where: { status: "NOW_SHOWING" },
      select: { slug: true, title: true },
    });

    return NextResponse.json({
      availableDates,
      activeDate,
      moviesFilter: moviesList,
      results: Array.from(groupedByCinema.values()).map((c) => ({
        ...c,
        movies: Object.values(c.movies),
      })),
    });
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    return NextResponse.json(
      { error: "Gagal memuat jadwal tayang" },
      { status: 500 }
    );
  }
}