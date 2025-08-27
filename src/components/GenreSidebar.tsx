import Link from "next/link";
import { getGenres } from "@/lib/genres";

export default async function GenreSidebar() {
  const genres = await getGenres();

  return (
    <aside className="w-48 bg-gray-900 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Жанры</h2>
      <ul className="flex flex-col gap-2">
        {genres.map((genre) => (
          <li key={genre.id}>
            <Link
              href={`/genre/${genre.id}/page/1`}
              className="block px-2 py-1 rounded hover:bg-red-600 transition"
            >
              {genre.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
