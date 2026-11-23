// app/api/movies/route.js

import { NextResponse } from "next/server";
import {
  getTrendingIndian,
  getRecentReleases,
  getTopGrossing,
  getMoviesByLanguage,
  getMoviesByGenre,
  getImageUrl,
} from "@/lib/tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    let movies = [];

    if (type === "trending") {
      movies = await getTrendingIndian();
    } else if (type === "in-theatres") {
      movies = await getRecentReleases();
    } else if (type === "top-grossing") {
      movies = await getTopGrossing();
    } else if (type === "language") {
      const lang = searchParams.get("lang");
      if (!lang) {
        return NextResponse.json({ error: "Missing lang" }, { status: 400 });
      }
      movies = await getMoviesByLanguage(lang);
    } else if (type === "genre") {
      const genre = searchParams.get("genre");
      if (!genre) {
        return NextResponse.json({ error: "Missing genre" }, { status: 400 });
      }
      movies = await getMoviesByGenre(genre);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const simplified = movies
      .filter((m) => m.poster_path)
      .map((m) => ({
        id: m.id,
        title: m.title,
        year: m.release_date ? m.release_date.slice(0, 4) : null,
        posterUrl: getImageUrl(m.poster_path, "w342"),
        rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : null,
      }));

    return NextResponse.json({ movies: simplified });
  } catch (error) {
    console.error("Movies API error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}