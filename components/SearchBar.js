// components/SearchBar.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const router = useRouter();

  // Debounced search effect
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(movieId) {
    setShowDropdown(false);
    setQuery("");
    router.push(`/movie/${movieId}`);
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <div
        className={`relative transition-all duration-300 ease-out ${
          isFocused ? "scale-105" : "scale-100"
        }`}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder="Search for a movie (e.g. Pathaan, Jawan, Animal)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim().length >= 2) setShowDropdown(true);
          }}
          onBlur={() => setIsFocused(false)}
          className={`pl-11 pr-10 h-14 text-base rounded-full bg-white text-black transition-all duration-300 ${
            isFocused
              ? "shadow-[0_0_0_4px_rgba(59,130,246,0.35)] ring-0"
              : "shadow-md"
          }`}
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-popover border rounded-xl shadow-lg overflow-hidden">
          {results.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleSelect(movie.id)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent text-left transition-colors"
            >
              {movie.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-8 h-12 object-cover rounded flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-12 bg-muted rounded flex-shrink-0" />
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate">{movie.title}</span>
                {movie.year && (
                  <span className="text-sm text-muted-foreground">
                    {movie.year}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown &&
        results.length === 0 &&
        !isLoading &&
        query.trim().length >= 2 && (
          <div className="absolute z-50 w-full mt-2 bg-popover border rounded-xl shadow-lg p-4 text-center text-muted-foreground text-sm">
            No movies found for &quot;{query}&quot;
          </div>
        )}
    </div>
  );
}