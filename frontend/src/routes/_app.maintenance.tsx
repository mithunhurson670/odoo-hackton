import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";
import { maintenance, vehicles } from "@/lib/mock";
import { KpiCard } from "@/components/kpi-card";

export const Route = createFileRoute("/_app/maintenance")({
  head: () => ({ meta: [{ title: "Maintenance — TransitOps" }] }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const [open, setOpen] = useState(false);
  const scheduled = maintenance.filter((m) => m.status === "scheduled").length;
  const inProgress = maintenance.filter((m) => m.status === "in-progress").length;
  const overdue = maintenance.filter((m) => m.status === "overdue").length;
  const spend = maintenance.reduce((a, b) => a + b.cost, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Maintenance</h1>
          <p className="mt-1 text-sm text-muted-foreground">Preventive schedule and workshop status</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90">
              <Plus className="mr-1.5 h-4 w-4" /> Log Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log maintenance activity</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Vehicle</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Type</Label><Input placeholder="Oil change" /></div>
              <div className="space-y-1.5"><Label>Date</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label>Cost (₹)</Label><Input type="number" placeholder="3800" /></div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select defaultValue="scheduled"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5"><Label>Notes</Label><Textarea placeholder="Optional notes" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90" onClick={() => setOpen(false)}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard label="Scheduled" value={String(scheduled)} accent="blue" icon={<Wrench className="h-5 w-5" />} />
        <KpiCard label="In progress" value={String(inProgress)} accent="yellow" icon={<Wrench className="h-5 w-5" />} />
        <KpiCard label="Overdue" value={String(overdue)} accent="red" icon={<Wrench className="h-5 w-5" />} />
        <KpiCard label="Total spend (MTD)" value={`₹${(spend / 1000).toFixed(1)}k`} accent="green" icon={<Wrench className="h-5 w-5" />} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Maintenance log</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenance.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-xs">{m.id}</TableCell>
                    <TableCell className="font-medium">{m.vehicle}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell>{new Date(m.date).toLocaleDateString()}</TableCell>
                    <TableCell>₹{m.cost.toLocaleString()}</TableCell>
                    <TableCell className="max-w-xs truncate text-xs text-muted-foreground">{m.notes ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={m.status} /></TableCell>
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
