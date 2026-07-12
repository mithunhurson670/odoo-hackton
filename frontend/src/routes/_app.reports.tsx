import { createFileRoute } from "@tanstack/react-router";
import { Download, TrendingUp, Truck, Fuel, IndianRupee } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  RadialBarChart, RadialBar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { fleetTrend, fuelSpendTrend, utilizationByType } from "@/lib/mock";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — TransitOps" }] }),
  component: ReportsPage,
});

function exportCsv() {
  const header = "month,trips,distance\n";
  const body = fleetTrend.map((r) => `${r.month},${r.trips},${r.distance}`).join("\n");
  const blob = new Blob([header + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transitops-fleet-report.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const radialData = utilizationByType.map((u, i) => ({
  name: u.name,
  value: u.value * 3,
  fill: ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"][i],
}));

function ReportsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Operational performance across your fleet</p>
        </div>
        <Button onClick={exportCsv} className="bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90">
          <Download className="mr-1.5 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard label="Trips (YTD)" value="1,842" delta={12.3} accent="blue" icon={<TrendingUp className="h-5 w-5" />} />
        <KpiCard label="Distance (km)" value="318k" delta={9.1} accent="yellow" icon={<Truck className="h-5 w-5" />} />
        <KpiCard label="Fuel spend" value="₹22.4L" delta={-4.2} accent="green" icon={<Fuel className="h-5 w-5" />} />
        <KpiCard label="Revenue" value="₹58.9L" delta={7.8} accent="red" icon={<IndianRupee className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Trips vs distance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={fleetTrend} margin={{ left: -10, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="trips" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="distance" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Fuel breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={fuelSpendTrend} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis dataKey="week" type="category" stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }} />
                <Bar dataKey="diesel" fill="var(--color-chart-1)" radius={[0, 6, 6, 0]} />
                <Bar dataKey="electric" fill="var(--color-chart-2)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Utilization by vehicle type</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart innerRadius="20%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar background dataKey="value" cornerRadius={8} />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
