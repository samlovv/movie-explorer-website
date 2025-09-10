"use client";

import { Genre } from "@/lib/genres";
import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
  movieGenres: Genre[];
  tvGenres: Genre[];
  query: string;
  setQuery: (q: string) => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function MobileMenu({
  open,
  onClose,
  movieGenres,
  tvGenres,
  query,
  setQuery,
  handleSearch,
}: Props) {
  if (!open) return null;

  const renderGenres = (type: "movie" | "tv" | "animations") => {
    const genres = type === "tv" ? tvGenres : movieGenres;
    return (
      <div className="grid grid-cols-2 gap-2 pl-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/genre/${genre.id}/page/1?type=${type}`}
            className="text-sm text-gray-300 hover:text-red-500 transition"
            onClick={onClose}
          >
            {genre.name}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-40 flex flex-col items-start p-6 overflow-y-auto animate-slide-in">
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
  );
}
