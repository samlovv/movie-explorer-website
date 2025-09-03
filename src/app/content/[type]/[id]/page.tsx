import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { getGenres, Genre } from "@/lib/genres";

type Params = { params: { id: string; type: "movie" | "tv" } };

export default async function ContentPage({ params }: Params) {
  const { id, type } = params;

  const movieRes = await tmdb.get(`/${type}/${id}`);
  const movie = movieRes.data;

  const genres: Genre[] = await getGenres();
  const [videosRes, creditsRes, similarRes] = await Promise.all([
    tmdb.get(`/${type}/${id}/videos`),
    tmdb.get(`/${type}/${id}/credits`),
    tmdb.get(`/${type}/${id}/similar`),
  ]);

  const videos = videosRes.data.results;
  const credits = creditsRes.data;
  const similar = similarRes.data.results;

  const trailer = videos.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  // режиссёр
  const director = credits.crew.find((c: any) => c.job === "Director");

  // только 5 актёров
  const cast = credits.cast.slice(0, 5);

  const title = type === "movie" ? movie.title : movie.name;
  const releaseDate = type === "movie" ? movie.release_date : movie.first_air_date;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      {/* Основная информация */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/no-image.png"
          }
          alt={title}
          className="w-full md:w-1/3 rounded-lg shadow-lg"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-gray-400 mb-4">📅 {releaseDate}</p>
          <p className="mb-4">{movie.overview}</p>
          <p className="text-yellow-400 font-semibold mb-4">
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </p>

          {director && (
            <p className="text-white mb-4">
              🎬 Режиссёр: <span className="font-semibold">{director.name}</span>
            </p>
          )}

          {/* Жанры */}
          <div className="flex flex-wrap gap-2 mt-2">
            {movie.genres.map((genre: Genre) => (
              <Link
                key={genre.id}
                href={`/genre/${genre.id}/page/1?type=${type}`}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Трейлер */}
      {trailer && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Трейлер</h2>
          <div className="relative" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Актёры */}
      {cast.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Актёры</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cast.map((actor: any) => (
              <Link
                key={actor.id}
                href={`/actors/${actor.id}`}
                className="bg-gray-900 rounded-lg overflow-hidden shadow hover:scale-105 transition"
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                      : "/no-image.png"
                  }
                  alt={actor.name}
                  className="w-full h-auto"
                />
                <div className="p-2">
                  <h3 className="text-sm font-semibold truncate">{actor.name}</h3>
                  <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* кнопка fullcast */}
          <div className="mt-4">
            <Link
              href={`/content/${type}/${id}/fullcredits`}
              className="inline-block px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
            >
              Полный состав & команда →
            </Link>
          </div>
        </section>
      )}

      {/* Похожее */}
      {similar.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Похожее</h2>
          <div className="relative">
            <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide">
              {similar.map((item: any) => {
                const simTitle = item.title || item.name;
                const simType = item.title ? "movie" : "tv";
                const typeLabel = simType === "movie" ? "Фильм" : "Сериал";

                return (
                  <Link
                    key={item.id + simType}
                    href={`/content/${simType}/${item.id}`}
                    className="w-[160px] flex-shrink-0 snap-start bg-gray-900 rounded-lg overflow-hidden shadow hover:scale-105 transition relative"
                  >
                    <img
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "/no-image.png"
                      }
                      alt={simTitle}
                      className="w-full h-auto"
                    />
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                      {typeLabel}
                    </span>
                    <div className="p-2">
                      <h3 className="text-sm font-semibold truncate">{simTitle}</h3>
                      <p className="text-xs text-gray-400">
                        ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
