import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Plus, Phone, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { drivers } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/drivers")({
  head: () => ({ meta: [{ title: "Drivers — TransitOps" }] }),
  component: DriversPage,
});

function daysUntil(date: string) {
  return Math.round((new Date(date).getTime() - Date.now()) / 86400000);
}

function DriversPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    return drivers.filter((d) => {
      const matchesQ = [d.name, d.license, d.id, d.phone].join(" ").toLowerCase().includes(q.toLowerCase());
      const matchesS = status === "all" || d.status === status;
      return matchesQ && matchesS;
    });
  }, [q, status]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Driver Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">{drivers.length} drivers on your roster</p>
        </div>
        <Button className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90">
          <Plus className="mr-1.5 h-4 w-4" /> Add Driver
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, license, phone…" className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[170px]"><Filter className="mr-1.5 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="on-duty">On duty</SelectItem>
              <SelectItem value="off-duty">Off duty</SelectItem>
              <SelectItem value="on-leave">On leave</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((d) => {
                  const days = daysUntil(d.licenseExpiry);
                  const expiring = days <= 90;
                  return (
                    <TableRow key={d.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {d.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-semibold">{d.name}</div>
                            <div className="text-xs text-muted-foreground">{d.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {d.phone}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{d.license}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "gap-1 font-medium",
                          expiring ? "border-danger/30 bg-danger/10 text-danger" : "border-success/30 bg-success/10 text-success",
                        )}>
                          {expiring && <AlertTriangle className="h-3 w-3" />}
                          {new Date(d.licenseExpiry).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          {expiring && ` · ${days}d`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{d.assignedVehicle ?? "—"}</TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-1 rounded-md bg-accent-yellow/25 px-2 py-0.5 text-xs font-semibold text-accent-yellow-foreground">
                          <Star className="h-3 w-3 fill-current" /> {d.rating}
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={d.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
