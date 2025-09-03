"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
    <select
      name="sort"
      value={sort_by}
      onChange={handleChange}
      className="bg-gray-800 text-white px-3 py-1 rounded"
    >
      <option value="popularity.desc">По популярности</option>
      <option value="vote_average.desc">По рейтингу</option>
      <option value="release_date.desc">По дате релиза</option>
    </select>
  );
}
