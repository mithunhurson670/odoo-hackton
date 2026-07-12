import { createFileRoute } from "@tanstack/react-router";
import {
  Truck, Users, MapPin, Fuel, ArrowUpRight, Activity,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { fleetTrend, fuelSpendTrend, trips, vehicles, utilizationByType } from "@/lib/mock";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — TransitOps" }] }),
  component: Dashboard,
});

const pieColors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function Dashboard() {
  const active = vehicles.filter((v) => v.status === "active").length;
  const utilization = Math.round((active / vehicles.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Operations overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live snapshot of your fleet, trips and spend for today.
          </p>
        </div>
        <Button className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90">
          <ArrowUpRight className="mr-1.5 h-4 w-4" /> New Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Vehicles" value={`${active}/${vehicles.length}`} delta={4.2} accent="blue" icon={<Truck className="h-5 w-5" />} />
        <KpiCard label="Drivers On-Duty" value="18" delta={2.1} accent="yellow" icon={<Users className="h-5 w-5" />} />
        <KpiCard label="Trips This Week" value="142" delta={11.4} accent="green" icon={<MapPin className="h-5 w-5" />} />
        <KpiCard label="Fuel Spend (MTD)" value="₹5.61L" delta={-3.7} accent="red" icon={<Fuel className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Fleet activity</CardTitle>
              <p className="text-xs text-muted-foreground">Trips completed and total distance</p>
            </div>
            <Button variant="outline" size="sm">Last 6 months</Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={fleetTrend} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }} />
                <Area type="monotone" dataKey="trips" stroke="var(--color-chart-1)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="distance" stroke="var(--color-chart-2)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fleet utilization</CardTitle>
            <p className="text-xs text-muted-foreground">By vehicle type</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={utilizationByType} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {utilizationByType.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Overall utilization</span>
                <span className="font-semibold">{utilization}%</span>
              </div>
              <Progress value={utilization} className="mt-2 h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent trips</CardTitle>
              <p className="text-xs text-muted-foreground">Latest 5 movements across the fleet</p>
            </div>
            <Button variant="ghost" size="sm">View all</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips.slice(0, 5).map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell className="font-medium">{t.origin} → {t.destination}</TableCell>
                      <TableCell className="text-muted-foreground">{t.vehicle}</TableCell>
                      <TableCell>{t.distanceKm} km</TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Fuel spend</CardTitle>
              <p className="text-xs text-muted-foreground">Weekly breakdown</p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={fuelSpendTrend} margin={{ left: -10, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }} />
                <Bar dataKey="diesel" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="electric" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vehicle status board</CardTitle>
          <p className="text-xs text-muted-foreground">Real-time state of every asset</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {vehicles.slice(0, 8).map((v) => (
              <div key={v.id} className="rounded-lg border border-border/60 p-4 transition-colors hover:border-primary/40 hover:bg-muted/30">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate font-mono text-xs text-muted-foreground">{v.id}</div>
                    <div className="mt-0.5 truncate font-semibold">{v.plate}</div>
                    <div className="truncate text-xs text-muted-foreground">{v.model}</div>
                  </div>
                  <StatusBadge status={v.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{v.fuelType}</span>
                  <span>{v.odometer.toLocaleString()} km</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
