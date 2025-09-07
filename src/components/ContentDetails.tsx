"use client";

import Link from "next/link";
import { Genre } from "@/lib/genres";

type Props = {
  movie: any;
  type: "movie" | "tv";
};

function getTitle(item: any, type: "movie" | "tv") {
  return type === "movie" ? item.title : item.name;
}

function getReleaseDate(item: any, type: "movie" | "tv") {
  return type === "movie" ? item.release_date : item.first_air_date;
}

export default function ContentDetails({ movie, type }: Props) {
  const title = getTitle(movie, type);
  const releaseDate = getReleaseDate(movie, type);

  const trailer = movie.videos.results.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  const director = movie.credits.crew.find((c: any) => c.job === "Director");
  const creator = type === "tv" ? movie.created_by?.[0] : null;
  const cast = movie.credits.cast.slice(0, 6);

  const similar = movie.similar.results
    .slice(0, 7)
    .map((item: any) => ({
      ...item,
      media_type: item.title ? "movie" : "tv",
    }));

  const getGenreNames = (ids: number[]) =>
    ids
      .map((id) => movie.genres.find((g: Genre) => g.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(", ");

  return (
    <main className="w-full text-white">
      {/* BACKDROP + POSTER */}
      <div className="relative w-full h-[500px]">
        {movie.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}

        {/* Градиент и blur для читаемости текста */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-sm" />

        {/* POSTER */}
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/no-image.png"
          }
          alt={title}
          className="absolute left-24 bottom-[-260px] w-48 md:w-64 rounded-xl shadow-2xl"
        />
      </div>

      {/* MOVIE INFO */}
      <div className="mt-15 px-6 md:pl-40 md:pr-25 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-gray-300 mb-2">Release Date: {releaseDate}</p>
        <p className="text-yellow-400 font-semibold mb-4 text-lg">
          ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
        </p>
        <p className="text-gray-200 mb-6 leading-relaxed">{movie.overview}</p>

        <div className="flex flex-wrap gap-3 mb-4">
          {director && (
            <span className="bg-gray-700 px-3 py-1 rounded">{`Director: ${director.name}`}</span>
          )}
          {creator && (
            <span className="bg-gray-700 px-3 py-1 rounded">{`Creator: ${creator.name}`}</span>
          )}
          {movie.genres.map((genre: Genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}/page/1?type=${type}`}
              className="bg-red-600/90 text-white px-3 py-1 rounded-full hover:bg-red-500 transition"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>

      {/* TRAILER */}
      {trailer && (
        <section className="mt-22 px-6 md:px-22">
          <h2 className="text-2xl font-bold mb-4">Trailer</h2>
          <div className="relative pt-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* CAST */}
      {cast.length > 0 && (
        <section className="mt-12 px-6 md:px-22">
          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cast.map((actor: any) => (
              <Link
                key={actor.id}
                href={`/actors/${actor.id}`}
                className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {actor.name}
                  </h3>
                  <p className="text-xs text-gray-300 truncate">
                    {actor.character}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* FULL CAST BUTTON */}
          <div className="mt-4">
            <Link
              href={`/content/${type}/${movie.id}/fullcredits`}
              className="inline-block px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition font-semibold"
            >
              Full Cast →
            </Link>
          </div>
        </section>
      )}

      {/* SIMILAR */}
      {similar.length > 0 && (
        <section className="mt-12 px-6 md:px-22 mb-12">
          <h2 className="text-2xl font-bold mb-4">Similar</h2>
          <div className="w-full overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-4" style={{ minWidth: "max-content" }}>
              {similar.map((item: any) => {
                const simTitle = item.title || item.name;
                const typeLabel = item.media_type === "movie" ? "Movie" : "TV";

                return (
                  <Link
                    key={item.id + item.media_type}
                    href={`/content/${item.media_type}/${item.id}`}
                    className="group movie-card snap-start min-w-[140px] w-[140px] md:min-w-[180px] md:w-[180px] flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden shadow-lg relative transform transition duration-300 hover:scale-105"
                  >
                    <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full z-10">
                      ⭐ {item.vote_average?.toFixed(1)}
                    </span>
                    <img
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "/no-image.png"
                      }
                      alt={simTitle}
                      className="w-full h-[200px] md:h-[270px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2">
                        {simTitle}
                      </h3>
                      <p className="text-[10px] md:text-xs text-gray-300 mt-1">
                        {getGenreNames(item.genre_ids || [])}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
