import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div>
          <Link href="/" className="text-2xl font-bold text-white">
            🎬 Movie Explorer
          </Link>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed">
            Discover movies, TV shows, and animations. Explore genres, ratings,
            and cast details with a modern and fast experience.
          </p>
        </div>

        {/* Movies */}
        <div>
          <h4 className="text-white font-semibold mb-3">Movies</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/genre/28/page/1?type=movie"
                className="hover:text-white transition"
              >
                Action
              </Link>
            </li>
            <li>
              <Link
                href="/genre/35/page/1?type=movie"
                className="hover:text-white transition"
              >
                Comedy
              </Link>
            </li>
            <li>
              <Link
                href="/genre/18/page/1?type=movie"
                className="hover:text-white transition"
              >
                Drama
              </Link>
            </li>
          </ul>
        </div>

        {/* TV Shows */}
        <div>
          <h4 className="text-white font-semibold mb-3">TV Shows</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/genre/10759/page/1?type=tv"
                className="hover:text-white transition"
              >
                Action & Adventure
              </Link>
            </li>
            <li>
              <Link
                href="/genre/35/page/1?type=tv"
                className="hover:text-white transition"
              >
                Comedy
              </Link>
            </li>
            <li>
              <Link
                href="/genre/80/page/1?type=tv"
                className="hover:text-white transition"
              >
                Crime
              </Link>
            </li>
          </ul>
        </div>

        {/* Animation */}
        <div>
          <h4 className="text-white font-semibold mb-3">Animation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/genre/16/page/1?type=movie"
                className="hover:text-white transition"
              >
                Animated Movies
              </Link>
            </li>
            <li>
              <Link
                href="/genre/16/page/1?type=tv"
                className="hover:text-white transition"
              >
                Animated TV
              </Link>
            </li>
            <li>
              <Link
                href="/genre/14/page/1?type=movie"
                className="hover:text-white transition"
              >
                Fantasy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        <p>
          © {new Date().getFullYear()} Movie Explorer. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
