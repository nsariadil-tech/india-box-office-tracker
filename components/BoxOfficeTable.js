// components/BoxOfficeTable.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Globe, Wallet } from "lucide-react";
import VerdictBadge from "./VerdictBadge";

export default function BoxOfficeTable({ boxOffice }) {
  const stats = [
    {
      label: "Budget",
      value: boxOffice.budget,
      icon: Wallet,
    },
    {
      label: "India Net Collection",
      value: boxOffice.indiaNet,
      icon: IndianRupee,
    },
    {
      label: "Worldwide Gross",
      value: boxOffice.worldwideGross,
      icon: Globe,
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Box Office</h2>        <VerdictBadge verdict={boxOffice.verdict} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value || "Not Available"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-zinc-400 mt-3">
                Box office figures are estimates sourced from public reports and may
        vary slightly across sources.
      </p>
    </div>
  );
}