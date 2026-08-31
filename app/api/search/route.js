// app/api/search/route.js

import { NextResponse } from "next/server";
import { searchMovies, getImageUrl } from "@/lib/tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchMovies(query.trim());

    // Trim down the payload to only what the dropdown needs
    const simplified = results.slice(0, 8).map((movie) => ({
      id: movie.id,
      title: movie.title,
      releaseDate: movie.release_date || null,
      year: movie.release_date ? movie.release_date.slice(0, 4) : null,
      posterUrl: getImageUrl(movie.poster_path, "w92"),
    }));

    return NextResponse.json({ results: simplified });
  } catch (error) {
    console.error("Search API error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}