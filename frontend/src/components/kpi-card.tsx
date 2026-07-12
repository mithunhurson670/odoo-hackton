import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number; // percent
  icon?: ReactNode;
  accent?: "blue" | "yellow" | "green" | "red";
}

const accentMap = {
  blue: "bg-primary/10 text-primary",
  yellow: "bg-accent-yellow/25 text-accent-yellow-foreground",
  green: "bg-success/15 text-success",
  red: "bg-danger/15 text-danger",
} as const;

export function KpiCard({ label, value, delta, icon, accent = "blue" }: KpiCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
            {value}
          </div>
          {delta !== undefined && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
              )}
            >
              {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {positive ? "+" : ""}
              {delta}% vs last month
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", accentMap[accent])}>
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
