import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const slug = decodeURIComponent(resolvedParams.slug || "").trim().toLowerCase();

    const { searchParams } = new URL(request.url);
    const selectedDate = searchParams.get("date") || "";

    const cinema = await prisma.cinema.findFirst({
      where: { slug },
      include: {
        showtimes: {
          include: {
            movieRel: true,
            _count: {
              select: { bookedSeats: true },
            },
          },
          orderBy: [{ showDate: "asc" }, { showTime: "asc" }],
        },
      },
    });

    if (!cinema) {
      return NextResponse.json(
        { error: "Bioskop tidak ditemukan" },
        { status: 404 }
      );
    }

    const availableDates = Array.from(
      new Set(cinema.showtimes.map((st) => st.showDate))
    ).sort();

    const activeDate =
      selectedDate && availableDates.includes(selectedDate)
        ? selectedDate
        : availableDates[0] || "";

    const filteredShowtimes = activeDate
      ? cinema.showtimes.filter((st) => st.showDate === activeDate)
      : cinema.showtimes;

    const moviesMap = new Map<
      string,
      {
        movieId: string | null;
        title: string;
        slug: string;
        genre: string;
        durationMin: number;
        rating: string;
        posterUrl: string;
        synopsis: string;
        schedules: Array<{
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
        }>;
      }
    >();

    for (const st of filteredShowtimes) {
      const key = st.movieRel?.slug || st.movieTitle;
      if (!moviesMap.has(key)) {
        moviesMap.set(key, {
          movieId: st.movieId,
          title: st.movieRel?.title || st.movieTitle,
          slug: st.movieRel?.slug || "default-movie",
          genre: st.movieRel?.genre || "Drama, Thriller",
          durationMin: st.movieRel?.durationMin || 115,
          rating: st.movieRel?.rating || st.rating,
          posterUrl: st.movieRel?.posterUrl || "/img/Resident_Evil.webp",
          synopsis:
            st.movieRel?.synopsis ||
            "Saksikan penayangan spesial di jaringan bioskop XXI.",
          schedules: [],
        });
      }

      const bookedCount = st._count.bookedSeats;
      moviesMap.get(key)!.schedules.push({
        id: st.id,
        studio: st.studio,
        studioType: st.studioType,
        showDate: st.showDate,
        showTime: st.showTime,
        ticketPrice: st.ticketPrice,
        adminFee: st.adminFee,
        totalSeats: st.totalSeats,
        bookedCount,
        availableSeats: Math.max(0, st.totalSeats - bookedCount),
      });
    }

    return NextResponse.json({
      cinema: {
        id: cinema.id,
        slug: cinema.slug,
        name: cinema.name,
        brand: cinema.brand,
        city: cinema.city,
        address: cinema.address,
        phone: cinema.phone,
        operatingHours: cinema.operatingHours,
        facilities: JSON.parse(cinema.facilities) as string[],
        studioTypes: cinema.studioTypes,
        totalStudios: cinema.totalStudios,
        ticketBaseInfo: cinema.ticketBaseInfo,
        mapUrl: cinema.mapUrl,
      },
      availableDates,
      activeDate,
      movies: Array.from(moviesMap.values()),
    });
  } catch (error) {
    console.error("Error fetching cinema detail:", error);
    return NextResponse.json(
      { error: "Gagal memuat detail bioskop" },
      { status: 500 }
    );
  }
}