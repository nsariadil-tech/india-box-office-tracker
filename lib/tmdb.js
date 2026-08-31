// lib/tmdb.js

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function getApiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error("TMDB_API_KEY is not set in environment variables");
  }
  return key;
}

/**
 * Search movies by title (used for the live search dropdown)
 */
export async function searchMovies(query) {
  const apiKey = getApiKey();
  const url = `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
    query
  )}&include_adult=false&language=en-US&page=1&region=IN`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.status}`);
  }

  const data = await res.json();
  return data.results || [];
}

/**
 * Get full movie details by TMDB id
 */
export async function getMovieDetails(id) {
  const apiKey = getApiKey();
  const url = `${TMDB_BASE_URL}/movie/${id}?api_key=${apiKey}&language=en-US`;

  const res = await fetch(url, { next: { revalidate: 86400 } });

  if (!res.ok) {
    throw new Error(`TMDB movie details failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Get cast & crew for a movie by TMDB id
 */
export async function getMovieCredits(id) {
  const apiKey = getApiKey();
  const url = `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${apiKey}&language=en-US`;

  const res = await fetch(url, { next: { revalidate: 86400 } });

  if (!res.ok) {
    throw new Error(`TMDB credits failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Helper to build a full poster/backdrop image URL from a TMDB path
 * size options: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original"
 */
export function getImageUrl(path, size = "w500") {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
/**
 * Get a batch of popular/trending movies (for homepage poster collage)
 */
export async function getPopularMovies() {
  const apiKey = getApiKey();
  const url = `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&region=IN&with_original_language=hi|te|ta|ml|kn&sort_by=popularity.desc&page=1`;

  const res = await fetch(url, { next: { revalidate: 21600 } });

  if (!res.ok) {
    throw new Error(`TMDB popular movies failed: ${res.status}`);
  }

  const data = await res.json();
  return data.results || [];
}
/**
 * Find the director from a credits.crew array
 */
export function getDirector(crew) {
  if (!crew) return null;
  const director = crew.find((person) => person.job === "Director");
  return director ? director.name : null;
}
