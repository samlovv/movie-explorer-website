"use client";

import Link from "next/link";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
};

type Section = {
  title: string;
  movies: Movie[];
};

type Genre = {
  id: number;
  name: string;
};

type Props = {
  sections: Section[];
  genres: Genre[];
};

export default function HomePage({ sections, genres }: Props) {
  const getGenreNames = (ids: number[]) =>
    ids
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(", ");

  return (
    <main className="py-6 px-6 md:px-20 flex gap-6 min-h-screen">
      <div className="flex-1 flex flex-col gap-12 overflow-y-auto">
        {sections.map((section) => (
          <section key={section.title} className="w-full">
            <h2 className="text-xl md:text-2xl font-bold mb-4">{section.title}</h2>

            <div className="w-full overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              <div className="flex gap-4" style={{ minWidth: "max-content" }}>
                {section.movies.slice(0, 20).map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/content/movie/${movie.id}`}
                    className="group movie-card snap-start min-w-[140px] w-[140px] md:min-w-[180px] md:w-[180px] flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden shadow-lg relative transform transition duration-300 hover:scale-105"
                  >
                    {/* Рейтинг */}
                    <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full z-10">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </span>

                    {/* Постер */}
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/no-image.png"
                      }
                      alt={movie.title}
                      className="w-full h-[200px] md:h-[270px] object-cover"
                    />

                    {/* Оверлей при наведении */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2">
                        {movie.title}
                      </h3>
                      <p className="text-[10px] md:text-xs text-gray-300 mt-1">
                        {getGenreNames(movie.genre_ids)}
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
