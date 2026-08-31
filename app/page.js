// app/page.js
"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    fetch("/api/trending")
      .then((res) => res.json())
      .then((data) => setPosters(data.posters || []))
      .catch(() => setPosters([]));
  }, []);

  // Repeat posters if needed to fill the grid nicely
  const gridPosters = posters.length > 0 ? [...posters, ...posters].slice(0, 24) : [];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-black">
      {/* Poster collage background */}
      <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 opacity-80">
        {gridPosters.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={url}
            alt=""
            className="w-full h-full object-cover aspect-[2/3]"
          />
        ))}
      </div>

            {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
            India Box Office Tracker
          </h1>
          <p className="text-gray-300 text-lg drop-shadow-md">
            Search any movie to see its budget, collections, and verdict.
          </p>
        </div>

        <SearchBar />
      </div>
    </main>
  );
}