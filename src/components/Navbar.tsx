import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Лого */}
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-red-600">
          Movie Explorer
        </Link>

        {/* Навигация */}
        <div className="flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-red-500 transition-colors">
            Home
          </Link>
          <Link href="/movies" className="hover:text-red-500 transition-colors">
            Movies
          </Link>
          <Link href="/actors" className="hover:text-red-500 transition-colors">
            Actors
          </Link>
        </div>
      </nav>
    </header>
  );
}
