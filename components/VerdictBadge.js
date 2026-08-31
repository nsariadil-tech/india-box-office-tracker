// components/VerdictBadge.js
import { Badge } from "@/components/ui/badge";

const VERDICT_STYLES = {
  Blockbuster: "bg-emerald-600 hover:bg-emerald-600 text-white",
  "All Time Blockbuster": "bg-emerald-700 hover:bg-emerald-700 text-white",
  "Super Hit": "bg-green-600 hover:bg-green-600 text-white",
  Hit: "bg-lime-600 hover:bg-lime-600 text-white",
  Average: "bg-yellow-500 hover:bg-yellow-500 text-black",
  "Below Average": "bg-orange-500 hover:bg-orange-500 text-white",
  Flop: "bg-red-600 hover:bg-red-600 text-white",
  Disaster: "bg-red-800 hover:bg-red-800 text-white",
};

export default function VerdictBadge({ verdict }) {
  const style =
    VERDICT_STYLES[verdict] || "bg-gray-500 hover:bg-gray-500 text-white";

  return (
    <Badge className={`${style} text-sm font-semibold px-3 py-1`}>
      {verdict || "Not Available"}
    </Badge>
  );
}