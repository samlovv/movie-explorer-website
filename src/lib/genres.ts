// lib/genres.ts
import { tmdb } from "@/lib/tmdb";

export type Genre = {
  id: number;
  name: string;
};

let cachedMovieGenres: Genre[] = [];
let cachedTvGenres: Genre[] = [];

export async function getMovieGenres(): Promise<Genre[]> {
  if (cachedMovieGenres.length > 0) return cachedMovieGenres;

  const res = await tmdb.get("/genre/movie/list");
  cachedMovieGenres = res.data.genres;
  return cachedMovieGenres;
}

export async function getTvGenres(): Promise<Genre[]> {
  if (cachedTvGenres.length > 0) return cachedTvGenres;

  const res = await tmdb.get("/genre/tv/list");
  cachedTvGenres = res.data.genres;
  return cachedTvGenres;
}

// Если нужно — объединяем уникальные жанры фильмов и сериалов
export async function getAllGenres(): Promise<Genre[]> {
  const [movies, tv] = await Promise.all([getMovieGenres(), getTvGenres()]);
  const map = new Map<number, Genre>();
  [...movies, ...tv].forEach((g) => map.set(g.id, g)); // id уникальны у TMDB
  return Array.from(map.values());
}

export function getGenreNames(ids: number[], genres: Genre[]): string {
  return ids
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .join(", ");
}
