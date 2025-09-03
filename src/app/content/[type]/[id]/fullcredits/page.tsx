import { tmdb } from "@/lib/tmdb";
import Link from "next/link";

type Params = { params: { id: string; type: "movie" | "tv" } };

export default async function FullCreditsPage({ params }: Params) {
  const { id, type } = params;

  const creditsRes = await tmdb.get(`/${type}/${id}/credits`);
  const credits = creditsRes.data;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Полный состав и команда</h1>

      {/* Актёры */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Актёры</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {credits.cast.map((actor: any) => (
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
      </section>

      {/* Команда */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Съёмочная группа</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {credits.crew.map((member: any) => (
            <div
              key={member.credit_id}
              className="bg-gray-900 p-4 rounded-lg shadow"
            >
              <p className="text-white font-semibold">{member.name}</p>
              <p className="text-gray-400 text-sm">{member.job}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <Link
          href={`/content/${type}/${id}`}
          className="inline-block px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          ← Назад к фильму
        </Link>
      </div>
    </main>
  );
}
