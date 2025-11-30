"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // nanti disambungkan ke backend FastAPI
    try {
      const res = await fetch("http://127.0.0.1:8000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        router.push("/admin/dashboard");
      } else {
        setErrorMsg(data.detail || "Login gagal");
      }
    } catch (err) {
      setErrorMsg("Server tidak dapat dihubungi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFE0EA]">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-center text-3xl font-bold text-[#FF7FA5] mb-6">
          Admin Login
        </h2>

        {errorMsg && (
          <p className="text-red-500 text-center mb-4 text-sm">{errorMsg}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF7FA5] outline-none"
              placeholder="Masukkan username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF7FA5] outline-none"
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF7FA5] text-white py-3 rounded-xl font-semibold hover:bg-[#ff6f98] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
