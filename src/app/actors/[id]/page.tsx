import { tmdb } from "@/lib/tmdb";
import Link from "next/link";

type Params = {
  params: { id: string };
};

export default async function ActorPage({ params }: Params) {
  const res = await tmdb.get(`/person/${params.id}`);
  const actor = res.data;

  const creditsRes = await tmdb.get(`/person/${params.id}/combined_credits`);
  const credits = creditsRes.data.cast;

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

      {/* Работы актёра */}
      <h2 className="text-2xl font-semibold mb-4">🎬 Работы</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {credits.slice(0, 12).map((item: any) => {
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

              {/* Метка типа контента */}
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
    </main>
  );
}
