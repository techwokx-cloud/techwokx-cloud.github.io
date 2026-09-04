"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock } from "lucide-react";
import { login } from "@/lib/dashboard-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter an email and password to continue.");
      return;
    }
    login(email.trim());
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
            Placeholder login — any email and password works for now.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-700 px-3 py-2.5">
              <Mail size={16} className="shrink-0 text-mist" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full min-w-0 bg-transparent text-sm text-white placeholder:text-mist focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-700 px-3 py-2.5">
              <Lock size={16} className="shrink-0 text-mist" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full min-w-0 bg-transparent text-sm text-white placeholder:text-mist focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}

          <button
            type="submit"
            className="btn-gradient focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm"
          >
            <Sparkles size={16} />
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
