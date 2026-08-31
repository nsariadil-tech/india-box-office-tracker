// components/CastList.js
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CastList({ cast }) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {cast.map((actor) => (
          <div key={actor.name} className="flex flex-col items-center text-center gap-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={actor.profileUrl} alt={actor.name} />
              <AvatarFallback>
                {actor.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-tight">{actor.name}</p>
              <p className="text-xs text-muted-foreground leading-tight">
                {actor.character}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}