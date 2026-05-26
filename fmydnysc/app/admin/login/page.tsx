"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Invalid username or password");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-black rounded-xl p-6 shadow-sm">
        <div className="flex flex-col items-center mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/1.jpeg" alt="Admin Logo" className="h-10 w-auto mb-2" /> 
          <h1 className="text-black text-lg font-black uppercase tracking-tight">Admin Dashboard</h1>
          <p className="text-black/40 text-[10px]">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-black mb-1">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              autoComplete="username" 
              className="w-full border border-black text-black text-xs px-3 py-2 outline-none focus:border-emerald-500 placeholder:text-black/20" 
              placeholder="admin" 
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-black mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              autoComplete="current-password" 
              className="w-full border border-black text-black text-xs px-3 py-2 outline-none focus:border-emerald-500 placeholder:text-black/20" 
              placeholder="••••••••" 
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 px-3 py-2 text-red-600 text-[11px] font-medium rounded" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-black text-xs uppercase tracking-widest py-2 rounded transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}