import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Filter, Pencil, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/status-badge";
import { vehicles as seed, type Vehicle } from "@/lib/mock";

export const Route = createFileRoute("/_app/vehicles")({
  head: () => ({ meta: [{ title: "Vehicle Registry — TransitOps" }] }),
  component: VehiclesPage,
});

const PAGE_SIZE = 6;

function VehiclesPage() {
  const [rows, setRows] = useState<Vehicle[]>(seed);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((v) => {
      const matchesQ = [v.plate, v.model, v.id, v.driver ?? ""].join(" ").toLowerCase().includes(q.toLowerCase());
      const matchesS = status === "all" || v.status === status;
      return matchesQ && matchesS;
    });
  }, [rows, q, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string) => setRows((r) => r.filter((v) => v.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Vehicle Registry</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} vehicles in your fleet</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90">
                <Plus className="mr-1.5 h-4 w-4" /> Add Vehicle
              </Button>
            </DialogTrigger>
            <VehicleDialog editing={editing} onClose={() => setOpen(false)} />
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search plate, model, driver…" className="pl-9" />
            </div>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-[170px]"><Filter className="mr-1.5 h-4 w-4" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Odometer</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Fuel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="py-16 text-center text-sm text-muted-foreground">No vehicles match your filters.</TableCell></TableRow>
                )}
                {paged.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="font-semibold">{v.plate}</div>
                      <div className="text-xs text-muted-foreground">{v.model} · {v.id}</div>
                    </TableCell>
                    <TableCell>{v.type}</TableCell>
                    <TableCell>{v.year}</TableCell>
                    <TableCell>{v.odometer.toLocaleString()} km</TableCell>
                    <TableCell className="text-muted-foreground">{v.driver ?? "—"}</TableCell>
                    <TableCell>{v.fuelType}</TableCell>
                    <TableCell><StatusBadge status={v.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => { setEditing(v); setOpen(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-danger" aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete {v.plate}?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently remove the vehicle from your registry. This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(v.id)} className="bg-danger text-destructive-foreground hover:bg-danger/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            <div>Showing {paged.length} of {filtered.length}</div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <span>Page {page} / {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VehicleDialog({ editing, onClose }: { editing: Vehicle | null; onClose: () => void }) {
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{editing ? `Edit ${editing.plate}` : "Add new vehicle"}</DialogTitle>
        <DialogDescription>Enter the vehicle details. Fields marked * are required.</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label>Plate number *</Label>
          <Input defaultValue={editing?.plate} placeholder="MH-12 AB 1234" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Model *</Label>
          <Input defaultValue={editing?.model} placeholder="Tata Ace Gold" />
        </div>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Input defaultValue={editing?.type} placeholder="Mini Truck" />
        </div>
        <div className="space-y-1.5">
          <Label>Year</Label>
          <Input type="number" defaultValue={editing?.year ?? 2024} />
        </div>
        <div className="space-y-1.5">
          <Label>Fuel type</Label>
          <Select defaultValue={editing?.fuelType ?? "Diesel"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Petrol">Petrol</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select defaultValue={editing?.status ?? "active"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90" onClick={onClose}>
          {editing ? "Save changes" : "Add vehicle"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
