import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { getGenres, getGenreNames } from "@/lib/genres";
import GenreSidebar from "@/components/GenreSidebar";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
};

async function getMovies(url: string, params = {}) {
  const res = await tmdb.get(url, { params });
  return res.data.results;
}

export default async function Home() {
  const genres = await getGenres();

  // Несколько категорий фильмов
  const [popular, horror, romance, drama, upcoming] = await Promise.all([
    getMovies("/movie/popular", { page: 1 }),
    getMovies("/discover/movie", { with_genres: 27, page: 1 }), // ужастики
    getMovies("/discover/movie", { with_genres: 10749, page: 1 }), // романтика
    getMovies("/discover/movie", { with_genres: 18, page: 1 }), // драмы
    getMovies("/movie/upcoming", { page: 1 }), // новинки
  ]);

  const sections = [
    { title: "Популярные фильмы", movies: popular },
    { title: "Ужастики", movies: horror },
    { title: "Романтика", movies: romance },
    { title: "Драмы", movies: drama },
    { title: "Новинки", movies: upcoming },
  ];

  return (
    <main className="p-6 flex gap-6 min-h-screen">
      {/* Sidebar */}
      <GenreSidebar />

      {/* Секции фильмов */}
      <div className="flex-1 flex flex-col gap-12 overflow-y-auto">
        {sections.map((section) => (
          <section key={section.title} className="w-full">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            
            {/* Контейнер с горизонтальным скроллом */}
            <div className="w-full overflow-x-auto pb-4">
              <div className="flex gap-4" style={{ minWidth: "max-content" }}>
                {section.movies.slice(0, 10).map((movie: Movie) => (
                  <Link
                    key={movie.id}
                    href={`/content/movie/${movie.id}`}
                    className="min-w-[125px] w-[125px] flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden shadow hover:scale-105 transition-transform duration-300 relative"
                  >
                    <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] px-1 py-0.5 rounded z-10">
                      Фильм
                    </span>
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/no-image.png"
                      }
                      alt={movie.title}
                      className="w-full h-[180px] object-cover"
                    />
                    <div className="p-1.5">
                      <h3 className="text-[11px] font-semibold truncate">{movie.title}</h3>
                      <p className="text-[10px] text-gray-400">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}