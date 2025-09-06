import { tmdb } from "@/lib/tmdb";
import { getAllGenres } from "@/lib/genres";
import HomePage from "@/components/HomePage";
import PopularMovies from "@/components/PopularMovies";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
};

async function getMovies(url: string, params = {}) {
  const res = await tmdb.get(url, { params });
  return res.data.results;
}

export default async function Home() {
  const genres = await getAllGenres();

  const popularRes = await tmdb.get("/movie/popular");
  const popularMovies = popularRes.data.results;

  const [ horror, romance, drama, upcoming] = await Promise.all([
    getMovies("/discover/movie", { with_genres: 27, page: 1 }), // ужастики
    getMovies("/discover/movie", { with_genres: 10749, page: 1 }), // романтика
    getMovies("/discover/movie", { with_genres: 18, page: 1 }), // драмы
    getMovies("/movie/upcoming", { page: 1 }), // новинки
  ]);

  const sections = [
    
    { title: "Horror", movies: horror },
    { title: "Romance", movies: romance },
    { title: "Drama", movies: drama },
    { title: "Upcoming", movies: upcoming },
  ];

  return <div className="mt-16">
            <PopularMovies movies={popularMovies} genres={genres} />
            <HomePage sections={sections} genres={genres} />
            
         </div>;
}
