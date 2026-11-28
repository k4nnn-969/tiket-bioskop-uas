import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "";
    const brand = searchParams.get("brand") || "";
    const query = searchParams.get("q")?.trim() || "";

    const cinemas = await prisma.cinema.findMany({
      where: {
        AND: [
          city && city !== "ALL" ? { city } : {},
          brand && brand !== "ALL" ? { brand } : {},
          query
            ? {
                OR: [
                  { name: { contains: query } },
                  { address: { contains: query } },
                  { city: { contains: query } },
                ],
              }
            : {},
        ],
      },
      include: {
        _count: {
          select: { showtimes: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const formattedCinemas = cinemas.map((cinema) => ({
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
      activeShowtimesCount: cinema._count.showtimes,
    }));

    const allCities = await prisma.cinema.findMany({
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    });

    return NextResponse.json({
      cinemas: formattedCinemas,
      cities: allCities.map((item) => item.city),
    });
  } catch (error) {
    console.error("Error fetching cinemas:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar bioskop" },
      { status: 500 }
    );
  }
}