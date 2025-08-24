import { tmdb } from "@/lib/tmdb";
import Link from "next/link";

type Params = {
  params: { id: string };
};

export default async function MoviePage({ params }: Params) {
  const res = await tmdb.get(`/movie/${params.id}`);
  const movie = res.data;

  const creditsRes = await tmdb.get(`/movie/${params.id}/credits`);
  const credits = creditsRes.data;

  return (
    <main className="p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg shadow"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-400 mb-4">📅 {movie.release_date}</p>
          <p className="mb-4">{movie.overview}</p>
          <p className="text-yellow-400 font-semibold">
            ⭐ {movie.vote_average.toFixed(1)} / 10
          </p>
        </div>
      </div>

      {/* Актёры */}
      <h2 className="text-2xl font-semibold mb-4">🎭 Актёры</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {credits.cast.slice(0, 12).map((actor: any) => (
          <Link
            key={actor.id}
            href={`/actors/${actor.id}`}
            className="bg-gray-900 rounded-lg overflow-hidden shadow hover:scale-105 transition"
          >
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                  : "/no-image.jpg"
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
    </main>
  );
}
