"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Definisikan warna Hijau baru
const COLORS = {
  bgMain: "bg-[#F4F7F2]",      // Latar belakang halaman
  greenText: "#2F4F3A",        // Teks utama, Judul, Background tombol Logout
  hoverBg: "hover:bg-[#DDE6D5]", // Background hover link sidebar
  asideBorder: "border-[#C8D3BE]", // Border sidebar
};

export default function AdminLayout({ children }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("adminToken");
    router.push("/login");
  };

  return (
    // Latar Belakang Layout
    <div className={`flex ${COLORS.bgMain} min-h-screen`}> 
      {/* Sidebar */}
      <aside className={`w-64 bg-white shadow-lg p-6 border-r ${COLORS.asideBorder}`}>
        {/* Judul Panel */}
        <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.greenText }}>Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          {/* Link-link dengan warna hover baru */}
          <Link href="/admin/dashboard" className={`block p-3 rounded-md ${COLORS.hoverBg}`}>Dashboard</Link>
          <Link href="/admin/kriteria" className={`block p-3 rounded-md ${COLORS.hoverBg}`}>Data Kriteria</Link>
          <Link href="/admin/kandungan" className={`block p-3 rounded-md ${COLORS.hoverBg}`}>Data Kandungan</Link>
          <Link href="/admin/produk" className={`block p-3 rounded-md ${COLORS.hoverBg}`}>Data Produk</Link>
          
          {/* Tombol Logout */}
          <button 
            onClick={logout} 
            className="mt-6 p-2 rounded-md text-white" 
            style={{ backgroundColor: COLORS.greenText }} // Background Hijau Tua
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}