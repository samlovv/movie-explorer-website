import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { getGenres, getGenreNames, Genre } from "@/lib/genres";

type Params = { params: { id: string } };

export default async function MoviePage({ params }: Params) {
  const [res, genres] = await Promise.all([
    tmdb.get(`/movie/${params.id}`),
    getGenres(),
  ]);

  const movie = res.data;
  const movieGenres: Genre[] = movie.genres; // TMDB уже возвращает массив жанров с id и name

  return (
    <main className="p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/no-image.jpg"
          }
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg shadow"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-400 mb-4">📅 {movie.release_date}</p>
          <p className="mb-4">{movie.overview}</p>
          <p className="text-yellow-400 font-semibold">
            ⭐ {movie.vote_average.toFixed(1)} / 10
          </p>

          {/* Жанры */}
          <div className="flex flex-wrap gap-2 mt-4">
            {movieGenres.map((genre) => (
              <Link
                key={genre.id}
                href={`/genre/${genre.id}/page/1`}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
