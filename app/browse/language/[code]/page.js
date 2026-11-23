// app/browse/language/[code]/page.js
import { notFound } from "next/navigation";
import MovieListPage from "@/components/MovieListPage";
import { LANGUAGES } from "@/lib/browse";

export default async function LanguagePage({ params }) {
  const { code } = await params;
  const language = LANGUAGES.find((l) => l.code === code);

  if (!language) notFound();

  return (
    <MovieListPage
      title={`${language.name} movies`}
      subtitle={`Popular ${language.name}-language films.`}
      endpoint={`/api/movies?type=language&lang=${language.code}`}
    />
  );
}