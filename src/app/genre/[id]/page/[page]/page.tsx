import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { getMovieGenres, getTvGenres } from "@/lib/genres";
import SortSelect from "@/components/SortSelect";

type Params = {
  params: { id: string; page: string };
  searchParams?: { [key: string]: string | string[] | undefined };
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

  // Get genres depending on type
  const genres = type === "tv"
    ? await getTvGenres()
    : await getMovieGenres();

  const genre = genres.find((g) => g.id === Number(id));

  let genreParam = id;
  if (type === "animations") {
    genreParam = `16,${id}`;
  }

  // Fetch data
  const resultsRes = await tmdb.get(
    type === "tv" ? "/discover/tv" : "/discover/movie",
    { params: { with_genres: genreParam, page, sort_by } }
  );

  const results = resultsRes.data.results.map((item: any) => ({
    ...item,
    media_type: type === "tv" ? "tv" : "movie",
  }));

  return (
    <main className="p-6 md:p-12 mt-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">
          {genre ? genre.name : "Unknown Genre"} — Page {page}
        </h1>
        <SortSelect sort_by={sort_by} type={type as string} id={id} page={page} />
      </div>

      {/* Grid of cards */}
      {results.length === 0 ? (
        <p className="text-gray-400 text-center">Nothing found 😔</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {results.map((item: any) => {
            const title = item.media_type === "movie" ? item.title : item.name;
            const typeLabel = item.media_type === "movie" ? "Movie" : "TV Show";

            return (
              <Link
                key={`${item.media_type}-${item.id}`}
                href={`/content/${item.media_type}/${item.id}`}
                className="group relative rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 bg-gray-900"
              >
                {/* Rating */}
                <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full z-10">
                  ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                </span>

                {/* Poster */}
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : "/no-image.png"
                  }
                  alt={title}
                  className="w-full h-[240px] md:h-[300px] object-cover"
                />

                {/* Gradient + info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-300 mt-1">{typeLabel}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-6">
        {Number(page) > 1 && (
          <Link
            href={`/genre/${id}/page/${Number(page) - 1}?type=${type}&sort=${sort_by}`}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            ⬅ Previous
          </Link>
        )}
        {Number(page) < resultsRes.data.total_pages && (
          <Link
            href={`/genre/${id}/page/${Number(page) + 1}?type=${type}&sort=${sort_by}`}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            Next ➡
          </Link>
        )}
      </div>
    </main>
  );
}
