// components/MovieHeader.js
import { Calendar, Clock, User } from "lucide-react";

export default function MovieHeader({ movie }) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Poster */}
      <div className="flex-shrink-0 mx-auto md:mx-0">
        {movie.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-56 rounded-xl shadow-2xl shadow-black/50 hover:scale-105 transition-transform duration-300 ring-1 ring-white/10"
          />
        ) : (
          <div className="w-56 h-80 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
            No Poster
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{movie.title}</h1>

        <div className="flex flex-wrap gap-2">
          {movie.genres?.map((genre) => (
            <span
              key={genre}
              className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
            >
              {genre}
            </span>
          ))}
        </div>

                <div className="flex flex-col gap-2 text-sm text-zinc-300 mt-2">
          {movie.releaseDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Released:{" "}
                {new Date(movie.releaseDate).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          {movie.runtime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            </div>
          )}
          {movie.director && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Director: {movie.director}</span>
            </div>
          )}
        </div>

        {movie.overview && (
           <p className="text-sm mt-3 max-w-xl leading-relaxed text-zinc-300">
            {movie.overview}
          </p>
        )}
      </div>
    </div>
  );
}