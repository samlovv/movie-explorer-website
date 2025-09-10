"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMovieGenres, getTvGenres, Genre } from "@/lib/genres";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<null | "movie" | "tv" | "animations">(null);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="absolute left-0 top-full w-[300px] md:w-[360px] bg-gray-900/95 backdrop-blur-md py-6 shadow-xl rounded-b-lg z-20">
        <div className="grid grid-cols-2 gap-4 px-6">
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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-lg px-6 md:px-16 py-4 flex justify-between items-center shadow-lg">
        {/* Logo */}
        <Link href="/" className="text-[21px] sm:text-2xl font-extrabold tracking-wide flex items-center gap-1">
          <span className="text-red-600">Movie</span>
          <span className="text-white">Explorer</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 relative items-center">
          <div
            className="relative"
            onMouseEnter={() => setActiveMenu("movie")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <span className="cursor-pointer hover:text-red-500 transition font-medium">Movies</span>
            {activeMenu === "movie" && renderGenres("movie")}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setActiveMenu("tv")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <span className="cursor-pointer hover:text-red-500 transition font-medium">TV Shows</span>
            {activeMenu === "tv" && renderGenres("tv")}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setActiveMenu("animations")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <span className="cursor-pointer hover:text-red-500 transition font-medium">Animations</span>
            {activeMenu === "animations" && renderGenres("animations")}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex ml-6">
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
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        movieGenres={movieGenres}
        tvGenres={tvGenres}
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
      />
    </>
  );
}
