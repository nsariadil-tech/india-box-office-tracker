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
// ---------- List helpers for the menu pages ----------

const INDIAN_LANGUAGES = "hi|te|ta|ml|kn";

/**
 * Shared helper: discover Indian-language movies with optional overrides
 */
async function discoverMovies(extraParams = {}, revalidate = 21600) {
  const apiKey = getApiKey();
  const params = new URLSearchParams({
    api_key: apiKey,
    language: "en-US",
    include_adult: "false",
    with_original_language: INDIAN_LANGUAGES,
    sort_by: "popularity.desc",
    page: "1",
    ...extraParams,
  });

  const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`TMDB discover failed: ${res.status}`);
  }

  const data = await res.json();
  return data.results || [];
}

/** Trending: currently popular Indian-language films */
export async function getTrendingIndian() {
  return discoverMovies();
}

/** In Theatres: Indian films released in the last 30 days */
export async function getRecentReleases() {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 30);
  const fmt = (d) => d.toISOString().slice(0, 10);

  return discoverMovies(
    {
      "primary_release_date.gte": fmt(from),
      "primary_release_date.lte": fmt(today),
    },
    3600
  );
}

/** Browse by language, e.g. "hi", "te", "ta", "ml", "kn" */
export async function getMoviesByLanguage(lang) {
  return discoverMovies({ with_original_language: lang });
}

/** Browse by TMDB genre id, e.g. 28 = Action */
export async function getMoviesByGenre(genreId) {
  return discoverMovies({ with_genres: String(genreId) });
}

/**
 * Top Grossing: a hand-picked list of big Indian hits, looked up on TMDB.
 * Edit this list anytime to add or remove films.
 * The order shown is the order listed here, not a computed ranking.
 */
const TOP_GROSSERS = [
  { title: "Pushpa 2: The Rule", year: 2024 },
  { title: "Dangal", year: 2016 },
  { title: "Baahubali 2: The Conclusion", year: 2017 },
  { title: "RRR", year: 2022 },
  { title: "KGF: Chapter 2", year: 2022 },
  { title: "Jawan", year: 2023 },
  { title: "Pathaan", year: 2023 },
  { title: "Animal", year: 2023 },
  { title: "Kalki 2898 AD", year: 2024 },
  { title: "Stree 2", year: 2024 },
  { title: "Gadar 2", year: 2023 },
  { title: "Bajrangi Bhaijaan", year: 2015 },
  { title: "PK", year: 2014 },
  { title: "Secret Superstar", year: 2017 },
];

export async function getTopGrossing() {
  const apiKey = getApiKey();

  const results = await Promise.all(
    TOP_GROSSERS.map(async ({ title, year }) => {
      const url = `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        title
      )}&primary_release_year=${year}&include_adult=false&language=en-US`;
      try {
        const res = await fetch(url, { next: { revalidate: 604800 } });
        if (!res.ok) {
          console.error(`Top grossing lookup failed for ${title}: ${res.status}`);
          return null;
        }
        const data = await res.json();
        return data.results?.[0] || null;
      } catch (err) {
        console.error(`Top grossing lookup error for ${title}:`, err.cause?.code || err.message);
        return null;
      }
    })
  );

  return results.filter(Boolean);
}