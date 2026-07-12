import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Fuel, Receipt } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KpiCard } from "@/components/kpi-card";
import { fuelLogs, expenses, fuelSpendTrend, vehicles } from "@/lib/mock";

export const Route = createFileRoute("/_app/fuel")({
  head: () => ({ meta: [{ title: "Fuel & Expense — TransitOps" }] }),
  component: FuelPage,
});

function FuelPage() {
  const [fuelOpen, setFuelOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  const fuelTotal = fuelLogs.reduce((a, b) => a + b.total, 0);
  const expenseTotal = expenses.reduce((a, b) => a + b.amount, 0);
  const avgMileage = 8.2;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Fuel & Expense</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track fuel consumption and operating costs</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={fuelOpen} onOpenChange={setFuelOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Fuel className="mr-1.5 h-4 w-4" /> Add Fuel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log fuel entry</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>Vehicle</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Date</Label><Input type="date" /></div>
                <div className="space-y-1.5"><Label>Station</Label><Input placeholder="IOCL Vashi" /></div>
                <div className="space-y-1.5"><Label>Litres</Label><Input type="number" placeholder="45" /></div>
                <div className="space-y-1.5"><Label>Cost / L (₹)</Label><Input type="number" placeholder="92.50" /></div>
                <div className="col-span-2 space-y-1.5"><Label>Odometer</Label><Input type="number" placeholder="48210" /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setFuelOpen(false)}>Cancel</Button>
                <Button className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90" onClick={() => setFuelOpen(false)}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90">
                <Plus className="mr-1.5 h-4 w-4" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record expense</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Toll">Toll</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Parking">Parking</SelectItem>
                      <SelectItem value="Repair">Repair</SelectItem>
                      <SelectItem value="Permit">Permit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Date</Label><Input type="date" /></div>
                <div className="col-span-2 space-y-1.5"><Label>Description</Label><Input placeholder="Mumbai-Pune Expressway toll" /></div>
                <div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" placeholder="320" /></div>
                <div className="space-y-1.5">
                  <Label>Vehicle (optional)</Label>
                  <Select><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setExpenseOpen(false)}>Cancel</Button>
                <Button className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90" onClick={() => setExpenseOpen(false)}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard label="Fuel spend" value={`₹${(fuelTotal / 1000).toFixed(1)}k`} delta={-2.4} accent="blue" icon={<Fuel className="h-5 w-5" />} />
        <KpiCard label="Other expenses" value={`₹${(expenseTotal / 1000).toFixed(1)}k`} delta={5.1} accent="yellow" icon={<Receipt className="h-5 w-5" />} />
        <KpiCard label="Avg mileage" value={`${avgMileage} km/L`} delta={1.6} accent="green" />
        <KpiCard label="Cost / km" value="₹11.4" delta={-0.8} accent="red" />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Fuel spend trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={fuelSpendTrend} margin={{ left: -10, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }} />
              <Line type="monotone" dataKey="diesel" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="electric" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="fuel">
        <TabsList>
          <TabsTrigger value="fuel">Fuel logs</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="fuel">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Log</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Station</TableHead>
                      <TableHead>Litres</TableHead>
                      <TableHead>₹/L</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fuelLogs.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-mono text-xs">{f.id}</TableCell>
                        <TableCell className="font-medium">{f.vehicle}</TableCell>
                        <TableCell>{new Date(f.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-muted-foreground">{f.station}</TableCell>
                        <TableCell>{f.liters} L</TableCell>
                        <TableCell>₹{f.costPerLiter.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold">₹{f.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {expenses.map((e) => (
              <Card key={e.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{e.category}</div>
                      <div className="mt-1 font-semibold">{e.description}</div>
                      <div className="mt-2 text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()} · {e.vehicle ?? "General"}</div>
                    </div>
                    <div className="font-display text-lg font-bold">₹{e.amount.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
