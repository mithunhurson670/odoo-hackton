import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "muted";

const toneMap: Record<Tone, string> = {
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-accent-yellow/30 text-accent-yellow-foreground border-accent-yellow/50",
  danger: "bg-danger/12 text-danger border-danger/25",
  info: "bg-primary/10 text-primary border-primary/20",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  let tone: Tone = "muted";
  if (["active", "on-duty", "completed", "operational"].includes(key)) tone = "success";
  else if (["maintenance", "scheduled", "in-progress", "in-transit", "on-leave"].includes(key)) tone = "info";
  else if (["idle", "off-duty"].includes(key)) tone = "muted";
  else if (["overdue", "cancelled", "retired"].includes(key)) tone = "danger";
  else if (["warning", "pending"].includes(key)) tone = "warning";

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium capitalize", toneMap[tone])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-success": tone === "success",
        "bg-primary": tone === "info",
        "bg-muted-foreground": tone === "muted",
        "bg-danger": tone === "danger",
        "bg-accent-yellow": tone === "warning",
      })} />
      {status.replace("-", " ")}
    </Badge>
  );
}
