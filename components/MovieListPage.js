// components/MovieListPage.js
"use client";

import { useEffect, useState } from "react";
import MovieGrid from "@/components/MovieGrid";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieListPage({ title, subtitle, endpoint }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        if (!cancelled) setMovies(data.movies || []);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Could not load movies. Check your connection and try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [endpoint, attempt]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          {subtitle && <p className="mt-2 text-zinc-400">{subtitle}</p>}
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[2/3] w-full rounded-lg bg-zinc-800" />
                <Skeleton className="mt-2 h-4 w-3/4 bg-zinc-800" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-16">
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={() => setAttempt((a) => a + 1)}
              className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && movies.length === 0 && (
          <p className="text-center py-16 text-zinc-400">
            No movies found here yet.
          </p>
        )}

        {!isLoading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} />
        )}
      </div>
    </main>
  );
}