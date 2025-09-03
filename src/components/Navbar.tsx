"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getGenres, Genre } from "@/lib/genres";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<null | "movie" | "tv" | "animations">(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchGenres() {
      const fetchedGenres = await getGenres();
      setGenres(fetchedGenres);
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
    return (
      <div className="absolute left-0 top-full w-[300px] bg-gray-800 py-6 shadow-lg z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6 px-6">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}/page/1?type=${type}`}
              className="text-white hover:text-red-500 transition"
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
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center relative">
      <Link href="/" className="text-2xl font-bold">
        Movie Explorer
      </Link>

      <div className="flex gap-6 relative">
        <div
          className="relative"
          onMouseEnter={() => setActiveMenu("movie")}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span className="cursor-pointer hover:text-red-500">Movies</span>
          {activeMenu === "movie" && renderGenres("movie")}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setActiveMenu("tv")}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span className="cursor-pointer hover:text-red-500">TV Shows</span>
          {activeMenu === "tv" && renderGenres("tv")}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setActiveMenu("animations")}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span className="cursor-pointer hover:text-red-500">Animations</span>
          {activeMenu === "animations" && renderGenres("animations")}
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Поиск..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-1 rounded-l bg-gray-800 text-white focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-1 bg-red-600 rounded-r hover:bg-red-500 transition"
        >
          Найти
        </button>
      </form>
    </nav>
  );
}
