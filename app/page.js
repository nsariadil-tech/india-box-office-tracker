// app/page.js
"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import DriftWall from "@/components/DriftWall";

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/movies?type=trending")
      .then((res) => res.json())
      .then((data) =>
        setItems(
          (data.movies || []).map((m) => ({
            image: m.posterUrl,
            title: m.title,
            href: `/movie/${m.id}`,
          }))
        )
      )
      .catch(() => setItems([]));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Drifting poster wall */}
      <div className="absolute inset-0">
        {items.length > 0 && (
          <DriftWall
            items={items}
            columns={7}
            tileWidth={150}
            tileHeight={225}
            gap={16}
            radius={12}
            tilt={9}
            turn={-5}
            perspective={1200}
            depth={120}
            speed={36}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={48}
            fade={0.55}
            dim={5.5}
            overlayColor="#000000"
          />
        )}
      </div>

      {/* Soft darkening so the title stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

      {/* Content */}
      <div className="pointer-events-none relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="pointer-events-auto w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
              India Box Office Tracker
            </h1>
            <p className="text-gray-200 text-lg drop-shadow-md">
              Search any movie to see its budget, collections, and verdict.
            </p>
          </div>

          <SearchBar />
        </div>
      </div>
    </main>
  );
}