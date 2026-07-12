import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, MapPin, ArrowRight, Clock, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { trips, vehicles, drivers } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/trips")({
  head: () => ({ meta: [{ title: "Trips — TransitOps" }] }),
  component: TripsPage,
});

const stages = ["scheduled", "in-transit", "completed"] as const;

function TripsPage() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("all");

  const rows = trips.filter((t) => status === "all" || t.status === status);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Trip Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Plan, dispatch and track every movement</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90">
              <Plus className="mr-1.5 h-4 w-4" /> Create Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Create new trip</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Origin</Label><Input placeholder="Mumbai" /></div>
                <div className="space-y-1.5"><Label>Destination</Label><Input placeholder="Pune" /></div>
              </div>
              <div className="space-y-1.5">
                <Label>Vehicle</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {vehicles.filter((v) => v.status === "active").map((v) => (
                      <SelectItem key={v.id} value={v.id}>{v.plate}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Driver</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {drivers.filter((d) => d.status === "on-duty").map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Departure</Label><Input type="datetime-local" /></div>
              <div className="space-y-1.5"><Label>Est. arrival</Label><Input type="datetime-local" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90" onClick={() => setOpen(false)}>Dispatch trip</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {trips.filter((t) => t.status === "in-transit").slice(0, 3).map((t) => (
          <Card key={t.id} className="overflow-hidden">
            <div className="h-1 bg-accent-yellow" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t.origin} <ArrowRight className="inline h-4 w-4 mx-1 text-muted-foreground" /> {t.destination}</CardTitle>
                <StatusBadge status={t.status} />
              </div>
              <p className="font-mono text-xs text-muted-foreground">{t.id} · {t.vehicle}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{t.distanceKm} km</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{new Date(t.departure).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <Timeline current={t.status} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All trips</CardTitle>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-transit">In transit</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">{t.id}</TableCell>
                    <TableCell className="font-medium">{t.origin} → {t.destination}</TableCell>
                    <TableCell>{t.vehicle}</TableCell>
                    <TableCell className="text-muted-foreground">{t.driver}</TableCell>
                    <TableCell className="text-xs">{new Date(t.departure).toLocaleString()}</TableCell>
                    <TableCell>{t.distanceKm} km</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Timeline({ current }: { current: string }) {
  const idx = stages.indexOf(current as (typeof stages)[number]);
  return (
    <ol className="flex items-center gap-2">
      {stages.map((s, i) => {
        const done = i <= idx || current === "completed";
        const active = i === idx;
        return (
          <li key={s} className="flex flex-1 items-center gap-2">
            <div className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
              done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              active && "ring-4 ring-primary/20",
            )}>
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className={cn("text-xs font-medium capitalize", done ? "text-foreground" : "text-muted-foreground")}>
                {s.replace("-", " ")}
              </div>
              {i < stages.length - 1 && <div className={cn("mt-1 h-0.5 w-full rounded-full", done ? "bg-primary/40" : "bg-muted")} />}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
