import { tmdb } from "@/lib/tmdb";

export type Genre = {
  id: number;
  name: string;
};

let cachedGenres: Genre[] = [];

export async function getGenres(): Promise<Genre[]> {
  if (cachedGenres.length > 0) return cachedGenres;

  const res = await tmdb.get("/genre/movie/list");
  cachedGenres = res.data.genres;
  return cachedGenres;
}

export function getGenreNames(ids: number[], genres: Genre[]): string {
  return ids
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .join(", ");
}
