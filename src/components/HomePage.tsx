"use client";

import Link from "next/link";
import { useEffect } from "react";
// import gsap from "gsap"; // можно подключить тут

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

type Props = {
  sections: Section[];
  genres: any[];
};

export default function HomePage({ sections, genres }: Props) {
  useEffect(() => {
    // Здесь можно использовать gsap или любые хуки
    // gsap.from(".movie-card", { opacity: 0, y: 50, stagger: 0.05 });
  }, []);

  return (
    <main className="py-6 px-20 flex gap-6 min-h-screen">
      <div className="flex-1 flex flex-col gap-12 overflow-y-auto">
        {sections.map((section) => (
          <section key={section.title} className="w-full">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>

            <div className="w-full overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              <div className="flex gap-4 " style={{ minWidth: "max-content" }}>
                {section.movies.slice(0, 20).map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/content/movie/${movie.id}`}
                    className="movie-card snap-start min-w-[125px] w-[125px] flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden shadow hover:scale-105 transition-transform duration-300 relative"
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
                      <h3 className="text-[11px] font-semibold truncate">
                        {movie.title}
                      </h3>
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
