// app/browse/genre/[id]/page.js
import { notFound } from "next/navigation";
import MovieListPage from "@/components/MovieListPage";
import { GENRES } from "@/lib/browse";

export default async function GenrePage({ params }) {
  const { id } = await params;
  const genre = GENRES.find((g) => String(g.id) === id);

  if (!genre) notFound();

  return (
    <MovieListPage
      title={`${genre.name} movies`}
      subtitle={`Popular ${genre.name.toLowerCase()} films from Indian cinema.`}
      endpoint={`/api/movies?type=genre&genre=${genre.id}`}
    />
  );
}