import { tmdb } from "@/lib/tmdb";
import ContentDetails from "@/components/ContentDetails";

type Params = { params: { id: string; type: "movie" | "tv" } };

export default async function ContentPage({ params }: Params) {
  const { id, type } = params;

  const res = await tmdb.get(`/${type}/${id}`, {
    params: { append_to_response: "videos,credits,similar" },
  });
  console.log(res.data);

  return <div className="mt-16">
      <ContentDetails movie={res.data} type={type} />
    </div>;
}
