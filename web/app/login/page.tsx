"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, KeyRound, Loader2 } from "lucide-react";
import { login } from "@/lib/dashboard-auth";

export default function LoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Enter your dashboard access key to continue.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await login(token.trim());
    setLoading(false);
    if (!result.ok) {
      setError(result.error || "Something went wrong.");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/Techwokx_Logo_full_final.png"
            alt="TechWokx"
            className="h-12 w-auto"
          />
          <p className="mt-3 text-sm text-mist">AI Business Control Center</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-dark rounded-2xl border-white/10 bg-navy-800 p-7"
        >
          <h1 className="text-lg font-bold text-white">Log in to your dashboard</h1>
          <p className="mt-1 text-sm text-mist">
            Enter your dashboard access key (the same key used for admin API access).
          </p>

          <div className="mt-6">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-700 px-3 py-2.5">
              <KeyRound size={16} className="shrink-0 text-mist" />
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Access key"
                autoFocus
                className="w-full min-w-0 bg-transparent text-sm text-white placeholder:text-mist focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? "Verifying..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
