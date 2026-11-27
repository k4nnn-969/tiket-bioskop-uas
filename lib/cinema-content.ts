export type MovieGenre = "action" | "drama" | "family";

export const promotions = [
  {
    tag: "Pilihan hari ini",
    title: "Waktunya movie date",
    description: "Hemat tiket untuk cerita yang ingin kamu bagi.",
    code: "MOVIEDATE",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tag: "Akhir pekan",
    title: "Weekend, layar lebar",
    description: "Mulai akhir pekanmu dengan film pilihan.",
    code: "WEEKEND",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
  },
  {
    tag: "Teman nonton",
    title: "Serunya rame-rame",
    description: "Ajak teman dan temukan film untuk semua.",
    code: "NONTONBARENG",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
  },
] as const;

export const upcomingMovies = [
  {
    title: "The Last Frontier",
    genre: "action",
    genreLabel: "Action · Petualangan",
    releaseDate: "12 Oktober 2026",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85",
    posterDescription: "Suasana sinematik film The Last Frontier",
  },
  {
    title: "After the Rain",
    genre: "drama",
    genreLabel: "Drama · Romance",
    releaseDate: "18 Oktober 2026",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=85",
    posterDescription: "Pemandangan laut untuk film After the Rain",
  },
  {
    title: "Little Big Adventure",
    genre: "family",
    genreLabel: "Keluarga · Petualangan",
    releaseDate: "24 Oktober 2026",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=700&q=85",
    posterDescription: "Hutan hijau untuk film Little Big Adventure",
  },
  {
    title: "Midnight Signal",
    genre: "action",
    genreLabel: "Action · Thriller",
    releaseDate: "31 Oktober 2026",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85",
    posterDescription: "Langit malam untuk film Midnight Signal",
  },
] as const satisfies ReadonlyArray<{
  title: string;
  genre: MovieGenre;
  genreLabel: string;
  releaseDate: string;
  image: string;
  posterDescription: string;
}>;
