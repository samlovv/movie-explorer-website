"use client";

import Link from "next/link";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genre_ids: number[];
};

type Genre = {
  id: number;
  name: string;
};

type Props = {
  movies: Movie[];
  genres: Genre[];
};

export default function PopularMovies({ movies, genres }: Props) {
  const swiperRef = useRef<any>(null);

  const getGenreNames = (ids: number[]) =>
    ids
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(", ");

  return (
    <section className="w-full py-8">
      <Swiper
        spaceBetween={20}
        slidesPerView={"auto"}
        centeredSlides={true} // центрируем активный слайд
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="px-4 md:px-16"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {movies.slice(0, 7).map((movie) => (
          <SwiperSlide
            key={movie.id}
            className="!w-[85%] md:!w-[70%]" // ширина слайда
          >
            <Link
              href={`/content/movie/${movie.id}`}
              className="block bg-gray-900 rounded-2xl overflow-hidden shadow-lg relative group"
              onMouseEnter={() => swiperRef.current?.autoplay.stop()}
              onMouseLeave={() => swiperRef.current?.autoplay.start()}
            >
              <img
                src={
                  movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                    : "/no-image.png"
                }
                alt={movie.title}
                className="w-full h-[320px] md:h-[500px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              <div className="absolute bottom-6 left-6 flex gap-6 items-end">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/no-image.png"
                  }
                  alt={movie.title}
                  className="w-[110px] md:w-[150px] rounded-lg shadow-xl"
                />
                <div className="max-w-[60%]">
                  <h3 className="text-xl md:text-3xl font-bold text-white drop-shadow-md mb-1">
                    {movie.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 mb-1">
                    {getGenreNames(movie.genre_ids)}
                  </p>
                  <p className="text-sm md:text-lg text-yellow-400 font-semibold">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
