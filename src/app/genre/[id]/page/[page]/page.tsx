import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { getGenres } from "@/lib/genres";

type Params = { params: { id: string; page: string } };

export async function generateMetadata({ params }: Params) {
  const genres = await getGenres();
  const genre = genres.find((g) => g.id === Number(params.id));
  return {
    title: genre ? `${genre.name} Movies - Page ${params.page}` : "Genre Movies",
    description: genre
      ? `Discover movies in the ${genre.name} genre. Page ${params.page} of popular movies.`
      : "Movies by genre",
  };
}

export default async function GenrePage({ params }: Params) {
  const { id, page } = params;

  const genres = await getGenres();
  const genre = genres.find((g) => g.id === Number(id));

  const res = await tmdb.get("/discover/movie", {
    params: { with_genres: id, page },
  });

  const movies = res.data.results;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {genre ? genre.name : "Unknown Genre"} — Страница {page}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie: any) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className="bg-gray-900 rounded-lg overflow-hidden shadow hover:scale-105 transition"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/no-image.jpg"
              }
              alt={movie.title}
              className="w-full h-auto"
            />
            <div className="p-2">
              <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
              <p className="text-xs text-gray-400">
                ⭐ {movie.vote_average.toFixed(1)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Пагинация */}
      <div className="flex justify-center mt-6 gap-4">
        {Number(page) > 1 && (
          <Link
            href={`/genre/${id}/page/${Number(page) - 1}`}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Назад
          </Link>
        )}
        {res.data.page < res.data.total_pages && (
          <Link
            href={`/genre/${id}/page/${Number(page) + 1}`}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Далее
          </Link>
        )}
      </div>
    </main>
  );
}
