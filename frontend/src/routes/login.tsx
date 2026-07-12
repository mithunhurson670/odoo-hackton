import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Mail, Lock, Truck, BarChart3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — TransitOps" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 500);
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.55_0.18_258/0.35),transparent_45%),radial-gradient(circle_at_80%_80%,oklch(0.88_0.17_92/0.25),transparent_40%)]" />
        <div className="relative flex h-full flex-col p-12">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent-yellow text-accent-yellow-foreground">
              <Zap className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-lg font-bold">TransitOps</div>
              <div className="text-[10px] uppercase tracking-widest opacity-60">Fleet Control</div>
            </div>
          </div>

          <div className="my-auto max-w-md">
            <h1 className="font-display text-4xl font-bold leading-tight">
              Move every vehicle, driver and trip from one control room.
            </h1>
            <p className="mt-4 text-sm text-sidebar-foreground/70">
              A modern operations platform built for logistics teams that ship on time — every time.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: Truck, title: "Live fleet visibility", desc: "Vehicles, drivers and trips in one place." },
                { icon: BarChart3, title: "Actionable analytics", desc: "Fuel, cost and utilization at a glance." },
                { icon: ShieldCheck, title: "Compliance first", desc: "License, permit and maintenance alerts." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sidebar-accent text-accent-yellow">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="text-xs text-sidebar-foreground/60">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-sidebar-foreground/50">
            © 2026 TransitOps · Hackathon Edition
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent-yellow text-accent-yellow-foreground">
              <Zap className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div className="font-display text-lg font-bold">TransitOps</div>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your operations console.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="ops@transitops.io" defaultValue="ops@transitops.io" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" defaultValue="demo1234" className="pl-9" required />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Checkbox defaultChecked /> Keep me signed in for 30 days
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-accent-yellow font-semibold text-accent-yellow-foreground hover:bg-accent-yellow/90"
            >
              {loading ? "Signing in…" : "Sign in to dashboard"}
            </Button>

            <Button type="button" variant="outline" className="h-11 w-full">
              Continue with SSO
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            New to TransitOps?{" "}
            <Link to="/dashboard" className="font-medium text-primary hover:underline">
              Explore the demo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
