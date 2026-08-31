// app/api/movie/route.js

import { NextResponse } from "next/server";
import {
  getMovieDetails,
  getMovieCredits,
  getImageUrl,
  getDirector,
} from "@/lib/tmdb";
import { getBoxOfficeData } from "@/lib/gemini";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing movie id parameter" },
      { status: 400 }
    );
  }

  try {
    // Fetch TMDB details + credits in parallel
    const [details, credits] = await Promise.all([
      getMovieDetails(id),
      getMovieCredits(id),
    ]);

    const releaseYear = details.release_date
      ? details.release_date.slice(0, 4)
      : "Unknown";

    // Get top 6 cast members
    const cast = (credits.cast || []).slice(0, 6).map((actor) => ({
      name: actor.name,
      character: actor.character,
      profileUrl: getImageUrl(actor.profile_path, "w185"),
    }));

    const director = getDirector(credits.crew);

    // Fetch box office data (Serper search + Gemini parse)
    let boxOffice;
    try {
      boxOffice = await getBoxOfficeData(details.title, releaseYear);
    } catch (boxOfficeError) {
      console.error("Box office fetch failed:", boxOfficeError.message);
      // Don't fail the whole request if box office data fails —
      // return the movie info with a fallback box office object
      boxOffice = {
        budget: "Not Available",
        indiaNet: "Not Available",
        worldwideGross: "Not Available",
        verdict: "Not Available",
      };
    }

    const payload = {
      id: details.id,
      title: details.title,
      overview: details.overview,
      releaseDate: details.release_date,
      releaseYear,
      posterUrl: getImageUrl(details.poster_path, "w500"),
      backdropUrl: getImageUrl(details.backdrop_path, "original"),
      runtime: details.runtime,
      genres: (details.genres || []).map((g) => g.name),
      director,
      cast,
      boxOffice,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Movie API error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch movie data" },
      { status: 500 }
    );
  }
}