import { tmdb } from "@/lib/tmdb";
import Link from "next/link";

type Params = {
  params: { id: string };
};

export default async function ActorFullCreditsPage({ params }: Params) {
  const res = await tmdb.get(`/person/${params.id}`);
  const actor = res.data;

  const creditsRes = await tmdb.get(`/person/${params.id}/combined_credits`);
  const credits = creditsRes.data.cast;

  // Разделяем по типу
  const movies = credits.filter((c: any) => c.media_type === "movie").slice(0, 20);
  const tvs = credits.filter((c: any) => c.media_type === "tv").slice(0, 20);

  return (
    <main className="p-6 md:p-12 mt-16">
      {/* Header актёра */}
      <div className="flex flex-col md:flex-row gap-8 bg-gray-900/60 p-6 rounded-xl shadow-lg mb-12">
        <img
          src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : "/no-image.png"}
          alt={actor.name}
          className="w-full md:w-64 rounded-xl shadow-2xl object-cover"
        />
        <div className="flex-1 flex flex-col gap-4 text-white">
          <h1 className="text-4xl font-bold">{actor.name}</h1>
          {actor.birthday && <p>🎂 {actor.birthday}</p>}
          {actor.place_of_birth && <p>🏠 {actor.place_of_birth}</p>}
          {actor.popularity && <p>🌟 Popularity: {actor.popularity.toFixed(1)}</p>}
          <div className="mt-2 max-h-64 overflow-y-auto text-gray-200 leading-relaxed p-3 bg-gray-800/50 rounded">
            {actor.biography || "No biography available."}
          </div>
        </div>
      </div>

      {/* Movies */}
      {movies.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">🎬 Movies</h2>
          <div className="w-full overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-4" style={{ minWidth: "max-content" }}>
              {movies.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/content/movie/${item.id}`}
                  className="group movie-card snap-start min-w-[140px] w-[140px] md:min-w-[180px] md:w-[180px] flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden shadow-lg relative transform transition duration-300 hover:scale-105"
                >
                  <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full z-10">
                    ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                  </span>
                  <img
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/no-image.png"}
                    alt={item.title}
                    className="w-full h-[200px] md:h-[270px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-300 mt-1">Movie</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TV Shows */}
      {tvs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">📺 TV Shows</h2>
          <div className="w-full overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-4" style={{ minWidth: "max-content" }}>
              {tvs.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/content/tv/${item.id}`}
                  className="group movie-card snap-start min-w-[140px] w-[140px] md:min-w-[180px] md:w-[180px] flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden shadow-lg relative transform transition duration-300 hover:scale-105"
                >
                  <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full z-10">
                    ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                  </span>
                  <img
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/no-image.png"}
                    alt={item.name}
                    className="w-full h-[200px] md:h-[270px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-300 mt-1">TV</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
