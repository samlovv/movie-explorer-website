"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search/${encodeURIComponent(query)}/page/1`);
    setQuery("");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link href='/' className="text-2xl font-bold">Movie Explorer</Link>

      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Поиск фильма..."
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
