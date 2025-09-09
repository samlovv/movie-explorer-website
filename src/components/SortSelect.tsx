"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react"; // иконка стрелки

type Props = {
  sort_by: string;
  type: string;
  id: string;
  page: string;
};

export default function SortSelect({ sort_by, type, id, page }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    router.push(`/genre/${id}/page/${page}?type=${type}&sort=${newSort}`);
  };

  return (
    <div className="relative inline-block">
      {/* Select */}
      <select
        name="sort"
        value={sort_by}
        onChange={handleChange}
        className="appearance-none bg-gray-900 text-white px-4 py-2 pr-10 rounded-lg shadow-md border border-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all cursor-pointer"
      >
        <option value="popularity.desc">🔥 Popularity</option>
        <option value="vote_average.desc">⭐ Rating</option>
        <option value="release_date.desc">📅 Release date</option>
      </select>

      {/* Custom arrow */}
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}
