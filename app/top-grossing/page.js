// app/top-grossing/page.js
import MovieListPage from "@/components/MovieListPage";

export default function TopGrossingPage() {
  return (
    <MovieListPage
      title="Top grossing"
      subtitle="Some of the biggest hits in Indian box office history."
      endpoint="/api/movies?type=top-grossing"
    />
  );
}