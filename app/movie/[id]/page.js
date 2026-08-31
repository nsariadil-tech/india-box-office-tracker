// app/movie/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import MovieHeader from "@/components/MovieHeader";
import BoxOfficeTable from "@/components/BoxOfficeTable";
import CastList from "@/components/CastList";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchMovie() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/movie?id=${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch movie data");
        }
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
        setError("Could not load movie details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white relative">
            {/* Ambient background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
      {/* Cinematic backdrop hero */}
      <div className="relative w-full h-[45vh] min-h-[320px] overflow-hidden">
        {movie?.backdropUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={movie.backdropUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
        )}
        {/* Gradient fade into content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-4 md:left-8 flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </button>
      </div>

      {/* Content, pulled up over the backdrop */}
      <div className="relative -mt-32 md:-mt-40 px-4 pb-12 max-w-4xl mx-auto z-10">
        {isLoading && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="w-56 h-80 rounded-xl mx-auto md:mx-0 bg-zinc-800" />
              <div className="flex-1 space-y-3 pt-16">
                <Skeleton className="h-10 w-2/3 bg-zinc-800" />
                <Skeleton className="h-4 w-1/3 bg-zinc-800" />
                <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                <Skeleton className="h-24 w-full bg-zinc-800" />
              </div>
            </div>
            <p className="text-center text-sm text-zinc-400 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Fetching live box office data, this can take up to 20 seconds...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-16">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {!isLoading && !error && movie && (
          <>
            <MovieHeader movie={movie} />
            <BoxOfficeTable boxOffice={movie.boxOffice} />
            <CastList cast={movie.cast} />
          </>
        )}
      </div>
    </main>
  );
}