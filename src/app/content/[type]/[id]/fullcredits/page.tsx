import { tmdb } from "@/lib/tmdb";
import Link from "next/link";

type Params = { params: { id: string; type: "movie" | "tv" } };

export default async function FullCreditsPage({ params }: Params) {
  const { id, type } = params;

  const creditsRes = await tmdb.get(`/${type}/${id}/credits`);
  const credits = creditsRes.data;

  // Отбираем топ 6 актёров
  const topCast = credits.cast.slice(0, 6);
  const fullCast = credits.cast.slice(6);

  return (
    <main className="p-6 md:p-12 max-w-7xl mt-16 mx-auto text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Full Cast & Crew</h1>

      {/* TOP BILLED CAST */}
      {topCast.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top Billed Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {topCast.map((actor: any) => (
              <Link
                key={actor.id}
                href={`/actors/${actor.id}`}
                className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition transform relative"
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                      : "/no-image.png"
                  }
                  alt={actor.name}
                  className="w-full h-[280px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                  <h3 className="text-sm md:text-base font-semibold text-white truncate">
                    {actor.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-300 truncate">
                    {actor.character}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FULL CAST */}
      {fullCast.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Full Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fullCast.map((actor: any) => (
              <Link
                key={actor.id}
                href={`/actors/${actor.id}`}
                className="group bg-gray-900 rounded-lg overflow-hidden shadow hover:scale-105 transition transform relative"
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                      : "/no-image.png"
                  }
                  alt={actor.name}
                  className="w-full h-[220px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {actor.name}
                  </h3>
                  <p className="text-xs text-gray-300 truncate">{actor.character}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CREW */}
      {credits.crew.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Crew</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {credits.crew.map((member: any) => (
              <div
                key={member.credit_id}
                className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition transform"
              >
                <div className="p-4">
                  <p className="text-white font-semibold text-lg">{member.name}</p>
                  <p className="text-gray-400 text-sm">{member.job}</p>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-50 transition" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BACK BUTTON */}
      <div className="mt-8">
        <Link
          href={`/content/${type}/${id}`}
          className="inline-block px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition font-semibold"
        >
          ← Back to Movie
        </Link>
      </div>
    </main>
  );
}
