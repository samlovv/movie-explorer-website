import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { getGenres } from "@/lib/genres";

type Params = { params: { id: string; page: string } };

export async function generateMetadata({ params }: Params) {
  const genres = await getGenres();
  const genre = genres.find((g) => g.id === Number(params.id));
  return {
    title: genre ? `${genre.name} — Page ${params.page}` : "Genre",
    description: genre
      ? `Discover movies and TV shows in the ${genre.name} genre. Page ${params.page}.`
      : "Browse by genre",
  };
}

export default async function GenrePage({ params }: Params) {
  const { id, page } = params;

  const genres = await getGenres();
  const genre = genres.find((g) => g.id === Number(id));

  // грузим фильмы и сериалы одновременно
  const [moviesRes, tvRes] = await Promise.all([
    tmdb.get("/discover/movie", { params: { with_genres: id, page } }),
    tmdb.get("/discover/tv", { params: { with_genres: id, page } }),
  ]);

  const movies = moviesRes.data.results.map((m: any) => ({
    ...m,
    media_type: "movie",
  }));
  const tv = tvRes.data.results.map((t: any) => ({
    ...t,
    media_type: "tv",
  }));

  // объединяем и сортируем по популярности
  const results = [...movies, ...tv].sort(
    (a, b) => b.popularity - a.popularity
  );

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {genre ? genre.name : "Unknown Genre"} — Страница {page}
      </h1>

      {results.length === 0 ? (
        <p>Ничего не найдено 😔</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {results.map((item: any) => {
            const title = item.media_type === "movie" ? item.title : item.name;
            const typeLabel =
              item.media_type === "movie" ? "Фильм" : "Сериал";

            return (
              <Link
                key={item.id + item.media_type}
                href={`/content/${item.media_type}/${item.id}`}
                className="bg-gray-900 rounded-lg overflow-hidden shadow hover:scale-105 transition relative"
              >
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : "/no-image.png"
                  }
                  alt={title}
                  className="w-full h-auto"
                />
                {/* Метка типа */}
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                  {typeLabel}
                </span>
                <div className="p-2">
                  <h3 className="text-sm font-semibold truncate">{title}</h3>
                  <p className="text-xs text-gray-400">
                    ⭐{" "}
                    {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Пагинация — берем из фильмов, но можно суммировать */}
      <div className="flex justify-center mt-6 gap-4">
        {Number(page) > 1 && (
          <Link
            href={`/genre/${id}/page/${Number(page) - 1}`}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Назад
          </Link>
        )}
        {moviesRes.data.page < moviesRes.data.total_pages && (
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
