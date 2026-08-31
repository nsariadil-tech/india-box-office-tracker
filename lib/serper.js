// lib/serper.js

const SERPER_URL = "https://google.serper.dev/search";

function getApiKey() {
  const key = process.env.SERPER_API_KEY;
  if (!key) {
    throw new Error("SERPER_API_KEY is not set in environment variables");
  }
  return key;
}

/**
 * Search Google (via Serper) for a movie's box office info.
 * Returns a combined text blob of relevant snippets for Gemini to parse.
 */
export async function fetchBoxOfficeSnippets(movieTitle, releaseYear) {
  const apiKey = getApiKey();

  const query = `${movieTitle} ${releaseYear} box office collection budget worldwide gross India verdict sacnilk`;

  const res = await fetch(SERPER_URL, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, gl: "in", num: 10 }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Serper search failed: ${res.status} - ${errText}`);
  }

  const data = await res.json();

  // Pull the useful text out of Serper's response:
  // - the "answerBox" (if Google shows a direct answer)
  // - "organic" results' titles + snippets
  const parts = [];

  if (data.answerBox) {
    const ab = data.answerBox;
    parts.push(
      `Answer Box: ${ab.title || ""} - ${ab.answer || ab.snippet || ""}`
    );
  }

  if (data.knowledgeGraph) {
    const kg = data.knowledgeGraph;
    parts.push(
      `Knowledge Graph: ${kg.title || ""} - ${
        kg.description || ""
      }`
    );
  }

  if (Array.isArray(data.organic)) {
    data.organic.slice(0, 8).forEach((item, i) => {
      parts.push(
        `Result ${i + 1}: ${item.title || ""}\n${item.snippet || ""}`
      );
    });
  }

  const combinedText = parts.join("\n\n");

  if (!combinedText.trim()) {
    throw new Error("Serper returned no usable search results");
  }

  return combinedText;
}