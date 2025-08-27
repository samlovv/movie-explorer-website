import { tmdb } from "@/lib/tmdb";
import Link from "next/link";

type Params = {
  params: { id: string };
};

export default async function ActorPage({ params }: Params) {
  const res = await tmdb.get(`/person/${params.id}`);
  const actor = res.data;

  const creditsRes = await tmdb.get(`/person/${params.id}/movie_credits`);
  const movies = creditsRes.data.cast;

  return (
    <main className="p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
              : "/no-image.png"
          }
          alt={actor.name}
          className="w-full md:w-1/3 rounded-lg shadow"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{actor.name}</h1>
          <p className="text-gray-400 mb-4">📅 {actor.birthday}</p>
          <p className="mb-4">{actor.biography || "Нет биографии"}</p>
        </div>
      </div>

      {/* Фильмы актёра */}
      <h2 className="text-2xl font-semibold mb-4">🎬 Фильмы</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.slice(0, 12).map((movie: any) => (
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
              <h3 className="text-sm font-semibold truncate">
                {movie.title}
              </h3>
              <p className="text-xs text-gray-400">
                ⭐ {movie.vote_average.toFixed(1)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
