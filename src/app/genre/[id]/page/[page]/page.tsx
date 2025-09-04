import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { getMovieGenres, getTvGenres } from "@/lib/genres";
import SortSelect from "@/components/SortSelect";

type Params = { 
  params: { id: string; page: string }; 
  searchParams?: { [key: string]: string | string[] | undefined } 
};

export async function generateMetadata({ params, searchParams }: Params) {
  const type = (searchParams?.type as string) || "movie";

  const genres = type === "tv" 
    ? await getTvGenres()
    : await getMovieGenres();

  const genre = genres.find((g) => g.id === Number(params.id));

  return {
    title: genre ? `${genre.name} — Page ${params.page}` : "Genre",
    description: genre
      ? `Discover ${type === "tv" ? "TV shows" : "movies"} in the ${genre.name} genre. Page ${params.page}.`
      : "Browse by genre",
  };
}

export default async function GenrePage({ params, searchParams }: Params) {
  const { id, page } = params;
  const type = searchParams?.type || "movie";
  const sort_by = (searchParams?.sort as string) || "popularity.desc";

  // Получаем жанры в зависимости от типа
  const genres = type === "tv" 
    ? await getTvGenres() 
    : await getMovieGenres();

  const genre = genres.find((g) => g.id === Number(id));

  let genreParam = id;
  if (type === "animations") {
    genreParam = `16,${id}`; // комбинируем Animation + выбранный жанр
  }

  // Загружаем данные
  const resultsRes = await tmdb.get(
    type === "tv" 
      ? "/discover/tv" 
      : "/discover/movie",
    { params: { with_genres: genreParam, page, sort_by } }
  );

  const results = resultsRes.data.results.map((item: any) => ({
    ...item,
    media_type: type === "tv" ? "tv" : "movie",
  }));

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {genre ? genre.name : "Unknown Genre"} — Страница {page}
        </h1>

        {/* Сортировка */}
        <SortSelect sort_by={sort_by} type={type as string} id={id} page={page} />
      </div>

      {results.length === 0 ? (
        <p>Ничего не найдено 😔</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {results.map((item: any) => {
            const title = item.media_type === "movie" ? item.title : item.name;
            const typeLabel = item.media_type === "movie" ? "Фильм" : "Сериал";

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
            href={`/genre/${id}/page/${Number(page) - 1}?type=${type}&sort=${sort_by}`}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Назад
          </Link>
        )}
        {Number(page) < resultsRes.data.total_pages && (
          <Link
            href={`/genre/${id}/page/${Number(page) + 1}?type=${type}&sort=${sort_by}`}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Далее
          </Link>
        )}
      </div>
    </main>
  );
}
