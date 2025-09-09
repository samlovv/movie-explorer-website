"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMovieGenres, getTvGenres, Genre } from "@/lib/genres";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<null | "movie" | "tv" | "animations">(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    setMobileOpen(false);
  };

  const renderGenres = (type: "movie" | "tv" | "animations") => {
    const genres = type === "tv" ? tvGenres : movieGenres;
    return (
      <div className="grid grid-cols-2 gap-2 pl-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/genre/${genre.id}/page/1?type=${type}`}
            className="text-sm text-gray-300 hover:text-red-500 transition"
            onClick={() => {
              setActiveMenu(null);
              setMobileOpen(false);
            }}
          >
            {genre.name}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <Link href="/" className="text-2xl font-extrabold tracking-wide">
        <span className="text-red-600">Movie</span>
        <span className="text-white">Explorer</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-10 relative items-center">
        <div
          className="relative"
          onMouseEnter={() => setActiveMenu("movie")}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span className="cursor-pointer hover:text-red-500 transition">Movies</span>
          {activeMenu === "movie" && (
            <div className="absolute left-0 top-full w-[320px] bg-gray-900/95 backdrop-blur-md py-6 shadow-xl rounded-b-lg z-20">
              <div className="grid grid-cols-2 gap-4 px-8">
                {movieGenres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genre/${genre.id}/page/1?type=movie`}
                    className="text-sm text-gray-200 hover:text-red-500 transition"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setActiveMenu("tv")}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span className="cursor-pointer hover:text-red-500 transition">TV Shows</span>
          {activeMenu === "tv" && (
            <div className="absolute left-0 top-full w-[320px] bg-gray-900/95 backdrop-blur-md py-6 shadow-xl rounded-b-lg z-20">
              <div className="grid grid-cols-2 gap-4 px-8">
                {tvGenres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genre/${genre.id}/page/1?type=tv`}
                    className="text-sm text-gray-200 hover:text-red-500 transition"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setActiveMenu("animations")}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span className="cursor-pointer hover:text-red-500 transition">Animations</span>
          {activeMenu === "animations" && (
            <div className="absolute left-0 top-full w-[320px] bg-gray-900/95 backdrop-blur-md py-6 shadow-xl rounded-b-lg z-20">
              <div className="grid grid-cols-2 gap-4 px-8">
                {movieGenres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genre/${genre.id}/page/1?type=animations`}
                    className="text-sm text-gray-200 hover:text-red-500 transition"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
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
      </div>

      {/* Mobile Burger */}
      <button
        className="md:hidden text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-40 flex flex-col items-start p-6 overflow-y-auto">
          {/* Close */}
          <button
            className="absolute top-6 right-6 text-gray-300"
            onClick={() => setMobileOpen(false)}
          >
            <X size={28} />
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex w-full mt-12 mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-2 rounded-l bg-gray-800/70 text-white focus:outline-none placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 rounded-r hover:bg-red-500 transition font-semibold"
            >
              Find
            </button>
          </form>

          {/* Sections */}
          <div className="space-y-6 w-full">
            <div>
              <h3 className="text-white font-semibold mb-2">Movies</h3>
              {renderGenres("movie")}
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">TV Shows</h3>
              {renderGenres("tv")}
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Animations</h3>
              {renderGenres("animations")}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
