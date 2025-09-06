"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMovieGenres, getTvGenres, Genre } from "@/lib/genres";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<null | "movie" | "tv" | "animations">(null);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchGenres() {
      const [movies, tv] = await Promise.all([getMovieGenres(), getTvGenres()]);
      setMovieGenres(movies);
      setTvGenres(tv);
    }
    fetchGenres();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search/${encodeURIComponent(query)}/page/1`);
    setQuery("");
  };

  const renderGenres = (type: "movie" | "tv" | "animations") => {
    const genres = type === "tv" ? tvGenres : movieGenres;

    return (
      <div className="absolute left-0 top-full w-[320px] bg-gray-900/95 backdrop-blur-md py-6 shadow-xl rounded-b-lg z-20">
        <div className="grid grid-cols-2 gap-4 px-8">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}/page/1?type=${type}`}
              className="text-sm text-gray-200 hover:text-red-500 transition"
              onClick={() => setActiveMenu(null)}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg px-22 py-5 flex justify-between items-center shadow-lg">
      {/* Лого Netflix-style */}
      <Link href="/" className="text-2xl font-extrabold tracking-wide">
        <span className="text-red-600">Movie</span>
        <span className="text-white">Explorer</span>
      </Link>

      {/* Навигация */}
      <div className="flex gap-10 relative">
        <div
          className="relative"
          onMouseEnter={() => setActiveMenu("movie")}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span className="cursor-pointer hover:text-red-500 transition">Movies</span>
          {activeMenu === "movie" && renderGenres("movie")}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setActiveMenu("tv")}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span className="cursor-pointer hover:text-red-500 transition">TV Shows</span>
          {activeMenu === "tv" && renderGenres("tv")}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setActiveMenu("animations")}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span className="cursor-pointer hover:text-red-500 transition">Animations</span>
          {activeMenu === "animations" && renderGenres("animations")}
        </div>
      </div>

      {/* Поиск */}
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-1 rounded-l bg-gray-800/70 text-white focus:outline-none placeholder-gray-400"
        />
        <button
          type="submit"
          className="px-4 py-1 bg-red-600 rounded-r hover:bg-red-500 transition font-semibold"
        >
          Find
        </button>
      </form>
    </nav>
  );
}
