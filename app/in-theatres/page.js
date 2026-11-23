// app/in-theatres/page.js
import MovieListPage from "@/components/MovieListPage";

export default function InTheatresPage() {
  return (
    <MovieListPage
      title="In theatres"
      subtitle="Indian releases from the last 30 days."
      endpoint="/api/movies?type=in-theatres"
    />
  );
}