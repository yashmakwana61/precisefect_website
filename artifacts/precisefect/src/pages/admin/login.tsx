import { useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { cmsApi } from "@/lib/cms-api";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await cmsApi.login(password);
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
      setLocation("/admin");
    } catch {
      setError("Incorrect password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-10 shadow-xl">
          <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center mb-8">
            <Lock className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-3">
            Restricted Access
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-3">
            Admin Console
          </h1>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Authenticate to manage site content. Sessions persist for 7 days.
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-primary tracking-[0.15em] uppercase mb-3"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                data-testid="input-admin-password"
                className="w-full px-5 py-4 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-container font-medium"
                placeholder="Enter admin password"
              />
            </div>

            {error && (
              <div className="text-sm text-destructive font-medium" data-testid="text-login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || password.length === 0}
              data-testid="button-admin-login"
              className="w-full signature-gradient text-white font-bold rounded-lg px-8 py-4 btn-press disabled:opacity-50"
            >
              {submitting ? "Authenticating…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
