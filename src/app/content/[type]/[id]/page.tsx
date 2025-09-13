import { tmdb } from "@/lib/tmdb";
import ContentDetails from "@/components/ContentDetails";
import type { Metadata } from "next";


type Params = { params: { id: string; type: "movie" | "tv" } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { type, id } = params;

  const res = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&append_to_response=videos,credits`
  );
  const data = await res.json();

  const title = type === "movie" ? data.title : data.name;
  const overview = data.overview || "Discover movies and TV shows on Movie Explorer.";

  return {
    title: `${title} | Movie Explorer`,
    description: overview,
    openGraph: {
      title: `${title} | Movie Explorer`,
      description: overview,
      images: data.poster_path
        ? [`https://image.tmdb.org/t/p/w500${data.poster_path}`]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Movie Explorer`,
      description: overview,
    },
  };
}

export default async function ContentPage({ params }: Params) {
  const { id, type } = params;

  const res = await tmdb.get(`/${type}/${id}`, {
    params: { append_to_response: "videos,credits,similar" },
  });

  return <div className="mt-16">
      <ContentDetails movie={res.data} type={type} />
    </div>;
}
