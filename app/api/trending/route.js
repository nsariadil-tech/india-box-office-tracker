// app/api/trending/route.js
import { NextResponse } from "next/server";
import { getPopularMovies, getImageUrl } from "@/lib/tmdb";

export async function GET() {
  try {
    const movies = await getPopularMovies();
    const posters = movies
      .filter((m) => m.poster_path)
      .slice(0, 20)
      .map((m) => getImageUrl(m.poster_path, "w342"));

    return NextResponse.json({ posters });
  } catch (error) {
    console.error("Trending API error:", error.message);
    return NextResponse.json({ posters: [] }, { status: 500 });
  }
}