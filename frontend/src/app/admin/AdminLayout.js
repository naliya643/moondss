"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Definisikan warna Hijau baru
const COLORS = {
  bgMain: "bg-[#F4F7F2]",         // Latar belakang halaman
  greenText: "#2F4F3A",           // Teks utama, Judul, Link, Background tombol Logout
  hoverBg: "hover:bg-[#DDE6D5]",  // Background hover link sidebar
  asideBorder: "border-[#C8D3BE]", // Border sidebar
  divider: "border-[#E6EDE1]"      // Garis lembut pemisah antar menu
};

export default function AdminLayout({ children }) {
  const router = useRouter();

  // 🔐 AUTH GUARD (route protection)
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin"); 
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin");
  };

  return (
    <div className={`flex ${COLORS.bgMain} min-h-screen`}>
      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg p-6 border-r ${COLORS.asideBorder}`}
      >
        {/* Judul Panel */}
        <h2
          className="text-2xl font-bold mb-8 text-center"
          style={{ color: COLORS.greenText }}
        >
          Admin Panel
        </h2>

        <nav className="flex flex-col">
          {/* Link Sidebar dengan garis lembut di perbatasan */}
          <Link
            href="/admin/dashboard"
            className={`block p-3 rounded-md transition-colors ${COLORS.hoverBg} border-b ${COLORS.divider}`}
            style={{ color: COLORS.greenText, fontWeight: 500 }}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/kriteria"
            className={`block p-3 rounded-md transition-colors ${COLORS.hoverBg} border-b ${COLORS.divider}`}
            style={{ color: COLORS.greenText, fontWeight: 500 }}
          >
            Kriteria
          </Link>

          <Link
            href="/admin/kandungan"
            className={`block p-3 rounded-md transition-colors ${COLORS.hoverBg} border-b ${COLORS.divider}`}
            style={{ color: COLORS.greenText, fontWeight: 500 }}
          >
            Data Kandungan
          </Link>

          <Link
            href="/admin/produk"
            className={`block p-3 rounded-md transition-colors ${COLORS.hoverBg} border-b ${COLORS.divider}`}
            style={{ color: COLORS.greenText, fontWeight: 500 }}
          >
            Data Produk
          </Link>

                    <Link
            href="/admin/perhitungan"
            className={`block p-3 rounded-md transition-colors ${COLORS.hoverBg} border-b ${COLORS.divider}`}
            style={{ color: COLORS.greenText, fontWeight: 500 }}
          >
            Perhitungan TOPSIS
          </Link>


          <Link
            href="/"
            className={`block p-3 rounded-md transition-colors ${COLORS.hoverBg} border-b ${COLORS.divider}`}
            style={{ color: COLORS.greenText, fontWeight: 500 }}
          >
            User View
          </Link>


          {/* Tombol Logout */}
          <button
            onClick={logout}
            className="mt-10 p-2 rounded-md text-white font-semibold shadow-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: COLORS.greenText }}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}