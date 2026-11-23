// components/MovieGrid.js
import GlossyPosterCard from "@/components/GlossyPosterCard";

export default function MovieGrid({ movies }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-7">
      {movies.map((movie) => (
        <GlossyPosterCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}