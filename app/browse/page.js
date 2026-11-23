// app/browse/page.js
import Link from "next/link";
import { LANGUAGES, GENRES } from "@/lib/browse";

export default function BrowsePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold">Browse</h1>
        <p className="mt-2 text-zinc-400">
          Explore Indian cinema by language or genre.
        </p>

        <h2 className="mt-10 mb-4 text-xl font-semibold">By language</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {LANGUAGES.map((lang) => (
            <Link
              key={lang.code}
              href={`/browse/language/${lang.code}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-800/80"
            >
              <p className="text-lg font-semibold">{lang.name}</p>
              <p className="mt-1 text-sm text-zinc-400">{lang.industry}</p>
            </Link>
          ))}
        </div>

        <h2 className="mt-10 mb-4 text-xl font-semibold">By genre</h2>
        <div className="flex flex-wrap gap-3">
          {GENRES.map((genre) => (
            <Link
              key={genre.id}
              href={`/browse/genre/${genre.id}`}
              className="rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm transition-colors hover:border-zinc-500 hover:bg-zinc-800"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}