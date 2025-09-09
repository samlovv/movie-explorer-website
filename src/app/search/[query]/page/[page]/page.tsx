import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { getMovieGenres, getTvGenres } from "@/lib/genres";

type Params = { params: { query: string; page: string } };

export default async function SearchPage({ params }: Params) {
  const { query, page } = params;

  // Multi search
  const res = await tmdb.get("/search/multi", {
    params: { query, page },
  });

  const results = res.data.results;

  // Жанры для фильмов и сериалов
  const movieGenres = await getMovieGenres();
  const tvGenres = await getTvGenres();

  return (
    <main className="p-6 md:p-12 mt-16 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-white mb-8">
        Search results for: "{decodeURIComponent(query)}" — Page {page}
      </h1>

      {results.length === 0 ? (
        <p className="text-gray-400 text-center">Nothing found 😔</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {results.map((item: any) => {
            if (item.media_type !== "movie" && item.media_type !== "tv") return null;

            const title = item.media_type === "movie" ? item.title : item.name;
            const href = `/content/${item.media_type}/${item.id}`;

            // Жанры
            const itemGenres =
              item.media_type === "movie"
                ? (item.genre_ids || [])
                    .map((gid: number) => movieGenres.find((g) => g.id === gid))
                    .filter(Boolean)
                : (item.genre_ids || [])
                    .map((gid: number) => tvGenres.find((g) => g.id === gid))
                    .filter(Boolean);

            return (
              <Link
                key={`${item.media_type}-${item.id}`}
                href={href}
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
                  <div className="flex flex-wrap gap-1 mt-1">
                    {itemGenres.length > 0 ? (
                      itemGenres.map((g: any) => (
                        <p
                          key={g.id}
                          className="text-[10px] md:text-xs text-gray-300 mt-1"
                        >
                          {g.name}
                        </p>
                      ))
                    ) : (
                      <span className="text-[10px] md:text-xs text-gray-400">
                        No genres
                      </span>
                    )}
                  </div>
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
            href={`/search/${query}/page/${Number(page) - 1}`}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            ⬅ Previous
          </Link>
        )}
        {res.data.page < res.data.total_pages && (
          <Link
            href={`/search/${query}/page/${Number(page) + 1}`}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            Next ➡
          </Link>
        )}
      </div>
    </main>
  );
}
