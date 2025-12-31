"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Login gagal");

      const data = await res.json();
      localStorage.setItem("adminToken", data.token);
      router.push("/admin/dashboard");
    } catch {
      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F2]">
      <form
        onSubmit={handleLogin}
        className="w-[360px] bg-white p-8 rounded-2xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center text-[#2F4F3A] mb-1">
          Admin Login
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Sistem SPK Skincare
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm text-[#2F4F3A] mb-1">
            Username
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-[#E6F9E6]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-[#2F4F3A] mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-[#E6F9E6]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-medium transition text-white 
            ${loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-[#2F4F3A] hover:bg-[#243d2d] active:scale-[0.98]"
            }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
