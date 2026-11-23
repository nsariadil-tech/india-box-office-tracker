// app/trending/page.js
import MovieListPage from "@/components/MovieListPage";

export default function TrendingPage() {
  return (
    <MovieListPage
      title="Trending"
      subtitle="What Indian audiences are watching right now."
      endpoint="/api/movies?type=trending"
    />
  );
}