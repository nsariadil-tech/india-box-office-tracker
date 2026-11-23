// components/GlossyPosterCard.js
"use client";

import { useRef } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import "./GlossyPosterCard.css";

const TILT = 8;

export default function GlossyPosterCard({ movie }) {
  const sceneRef = useRef(null);

  function handleMove(e) {
    if (e.pointerType !== "mouse") return;
    const el = sceneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.style.setProperty("--rx", `${((y * 2 - 1) * TILT).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(-(x * 2 - 1) * TILT).toFixed(2)}deg`);
  }

  function handleLeave() {
    const el = sceneRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <Link href={`/movie/${movie.id}`} className="block">
      <div
        ref={sceneRef}
        className="gpc-scene"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        <div className="gpc-card">
          <div className="gpc-frame">
            <div className="gpc-poster">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
              {movie.rating ? (
                <div className="gpc-badge">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {movie.rating}
                </div>
              ) : null}
              <span className="gpc-glare" />
              <span className="gpc-sheen" />
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-white truncate">
        {movie.title}
      </p>
      {movie.year && <p className="text-xs text-zinc-400">{movie.year}</p>}
    </Link>
  );
}