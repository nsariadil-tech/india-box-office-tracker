// lib/gemini.js

const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = "gemini-3.6-flash";

function getApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }
  return key;
}

/**
 * Takes raw search-result text and parses it into strict JSON
 * containing box office data. No search grounding used here —
 * pure text-in, JSON-out (stays on Gemini's free tier).
 */
export async function parseBoxOfficeJson(rawText, movieTitle) {
  const apiKey = getApiKey();
  const url = `${GEMINI_BASE_URL}/${MODEL}:generateContent`;

  const prompt = `You are extracting Indian box office data for the movie "${movieTitle}" from the following Google search results text.

Return ONLY a JSON object with these exact keys:
- "budget": string (e.g. "₹250 Cr" or "Not Available")
- "indiaNet": string (e.g. "₹450 Cr" or "Not Available")
- "worldwideGross": string (e.g. "₹1000 Cr" or "Not Available")
- "verdict": string (e.g. "Blockbuster", "Hit", "Average", "Flop", "Disaster", or "Not Available")

If the numbers aren't explicitly stated, make your best inference from context. If truly no relevant data exists, use "Not Available" for that field.

Search results text:
"""
${rawText}
"""`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini JSON parse failed: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned no JSON content");
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Gemini returned invalid JSON: ${text}`);
  }
}

/**
 * Public function: fetches search snippets (via Serper) then
 * parses them into clean box office JSON (via Gemini).
 */
export async function getBoxOfficeData(movieTitle, releaseYear) {
  const { fetchBoxOfficeSnippets } = await import("./serper");
  const rawText = await fetchBoxOfficeSnippets(movieTitle, releaseYear);
  const jsonData = await parseBoxOfficeJson(rawText, movieTitle);
  return jsonData;
}