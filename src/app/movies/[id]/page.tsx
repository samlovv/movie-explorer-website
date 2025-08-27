import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { getGenres, Genre } from "@/lib/genres";

type Params = { params: { id: string } };

export default async function MoviePage({ params }: Params) {
  const [resMovie, genresRes, videosRes, creditsRes, similarRes] =
    await Promise.all([
      tmdb.get(`/movie/${params.id}`),
      getGenres(),
      tmdb.get(`/movie/${params.id}/videos`),
      tmdb.get(`/movie/${params.id}/credits`),
      tmdb.get(`/movie/${params.id}/similar`),
    ]);

  const movie = resMovie.data;
  const genres: Genre[] = genresRes;
  const videos = videosRes.data.results;
  const credits = creditsRes.data;
  const similarMovies = similarRes.data.results;

  // Трейлер
  const trailer = videos.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  // Первые 12 актёров
  const cast = credits.cast.slice(0, 12);

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
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg shadow-lg"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-400 mb-4">📅 {movie.release_date}</p>
          <p className="mb-4">{movie.overview}</p>
          <p className="text-yellow-400 font-semibold mb-4">
            ⭐ {movie.vote_average.toFixed(1)} / 10
          </p>

          {/* Жанры */}
          <div className="flex flex-wrap gap-2 mt-2">
            {movie.genres.map((genre: Genre) => (
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
                  <p className="text-xs text-gray-400 truncate">
                    {actor.character}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Похожие фильмы */}
      {similarMovies.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Похожие фильмы</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {similarMovies.map((movie: any) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="flex-none w-40 md:w-48 bg-gray-900 rounded-lg overflow-hidden shadow hover:scale-105 transition-transform"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/no-image.png"
                  }
                  alt={movie.title}
                  className="w-full h-auto rounded-t-lg"
                />
                <div className="p-2">
                  <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
                  <p className="text-xs text-gray-400">⭐ {movie.vote_average.toFixed(1)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
