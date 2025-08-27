import { tmdb } from "@/lib/tmdb";
import Link from "next/link";

type Params = { params: { query: string; page: string } };

export default async function SearchPage({ params }: Params) {
  const { query, page } = params;

  // Multi search: фильмы и сериалы
  const res = await tmdb.get("/search/multi", {
    params: { query, page },
  });

  const results = res.data.results;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Результаты поиска: "{decodeURIComponent(query)}" — Страница {page}
      </h1>

      {results.length === 0 ? (
        <p>Фильмы и сериалы не найдены 😔</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.map((item: any) => {
            let title = "";
            let href = "";
            let typeLabel = "";

            if (item.media_type === "movie") {
            title = item.title;
            href = `/content/movie/${item.id}`;
            typeLabel = "Фильм";
            } else if (item.media_type === "tv") {
            title = item.name;
            href = `/content/tv/${item.id}`;
            typeLabel = "Сериал";
            } else {
            return null; // игнорируем людей
            }

            return (
            <Link
                key={item.id + item.media_type}
                href={href}
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
                    ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                </p>
                </div>
            </Link>
            );
        })}
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
