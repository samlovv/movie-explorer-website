import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { getGenres, getGenreNames } from "@/lib/genres";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
};

export default async function Home() {
  const [res, genres] = await Promise.all([
    tmdb.get("/movie/popular"),
    getGenres(),
  ]);

  const movies: Movie[] = res.data.results;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔥 Популярные фильмы</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className="bg-gray-900 rounded-lg overflow-hidden shadow hover:scale-105 transition"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto"
            />
            <div className="p-2">
              <h2 className="text-sm font-semibold truncate">{movie.title}</h2>
              <p className="text-xs text-gray-400">
                ⭐ {movie.vote_average.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {getGenreNames(movie.genre_ids, genres)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
