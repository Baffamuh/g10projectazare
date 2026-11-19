import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LayoutDashboard, Building2, LogOut, MapPin, Inbox, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/g10/logo";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Staff Portal — G10 City Project" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/sales", label: "Sales & Receipts", icon: Receipt },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/locations", label: "Locations", icon: MapPin },
] as const;

function AdminLayout() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isStaff, setIsStaff] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      if (data.user) {
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
        setIsStaff((roles ?? []).length > 0);
      } else setIsStaff(null);
    };
    check();
    const { data } = supabase.auth.onAuthStateChange((e) => { if (e === "SIGNED_IN" || e === "SIGNED_OUT") check(); });
    return () => data.subscription.unsubscribe();
  }, []);

  if (user === undefined) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!user) return <Login />;
  if (isStaff === null) return <div className="p-10 text-center text-muted-foreground">Checking access…</div>;
  if (!isStaff) return (
    <div className="mx-auto max-w-md p-10 text-center">
      <h1 className="text-xl font-bold">No staff access</h1>
      <p className="mt-2 text-muted-foreground">This account is not a G10 staff account.</p>
      <Button className="mt-4" variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="no-print mb-6 flex items-center gap-2 overflow-x-auto rounded-2xl bg-sidebar p-2 text-sidebar-foreground">
        {NAV.map(({ to, label, icon: I, ...rest }) => (
          <Link key={to} to={to} activeOptions={{ exact: "exact" in rest }} className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-sidebar-accent"
            activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary" }}>
            <I className="size-4" /> {label}
          </Link>
        ))}
        <button onClick={() => supabase.auth.signOut()} className="ml-auto flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-sidebar-accent"><LogOut className="size-4" /> Sign out</button>
      </div>
      <Outlet />
    </div>
  );
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const up = mode === "up";
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="rounded-3xl border bg-card p-6 shadow-card">
        <Logo className="mx-auto h-20 w-20" />
        <h1 className="mt-4 text-center text-xl font-bold text-primary-deep">Staff Portal</h1>
        <p className="text-center text-sm text-muted-foreground">{up ? "Create your staff account" : "Sign in with your staff email"}</p>
        <form className="mt-6 space-y-3" onSubmit={async (e) => {
          e.preventDefault(); setBusy(true);
          const { error } = up
            ? await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin + "/admin" } })
            : await supabase.auth.signInWithPassword({ email: email.trim(), password });
          setBusy(false);
          if (error) toast.error(error.message);
          else if (up) toast.success("Account created");
        }}>
          <Input type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder={up ? "Password (min 6 characters)" : "Password"} minLength={6} autoComplete={up ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button className="w-full" size="lg" disabled={busy}>{busy ? "Please wait…" : up ? "Create account" : "Sign in"}</Button>
        </form>
        <button type="button" className="mt-4 w-full text-center text-sm font-semibold text-primary" onClick={() => setMode(up ? "in" : "up")}>
          {up ? "Already have an account? Sign in" : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
}
