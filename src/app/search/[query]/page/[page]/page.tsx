import { tmdb } from "@/lib/tmdb";
import Link from "next/link";

type Params = { params: { query: string; page: string } };

export default async function SearchPage({ params }: Params) {
  const { query, page } = params;

  const res = await tmdb.get("/search/movie", {
    params: { query, page },
  });

  const movies = res.data.results;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Результаты поиска: "{query}" — Страница {page}
      </h1>

      {movies.length === 0 ? (
        <p>Фильмы не найдены 😔</p>
      ) : (
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
                    : "/no-image.png"
                }
                alt={movie.title}
                className="w-full h-auto"
              />
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
                <p className="text-xs text-gray-400">⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Пагинация */}
      <div className="flex justify-center mt-6 gap-4">
        {Number(page) > 1 && (
          <Link
            href={`/search/${query}/page/${Number(page) - 1}`}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Назад
          </Link>
        )}
        {res.data.page < res.data.total_pages && (
          <Link
            href={`/search/${query}/page/${Number(page) + 1}`}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Далее
          </Link>
        )}
      </div>
    </main>
  );
}
