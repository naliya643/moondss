"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("adminToken");
    router.push("/login");
  };

  return (
    <div className="flex bg-[#F7FEF8] min-h-screen">
      <aside className="w-64 bg-white shadow-lg p-6 border-r border-[#ffd6e6]">
        <h2 className="text-2xl font-bold mb-6 text-[#FF7FA5]">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <Link href="/admin/dashboard" className="block p-3 rounded-md hover:bg-[#fff0f6]">Dashboard</Link>
          <Link href="/admin/kriteria" className="block p-3 rounded-md hover:bg-[#fff0f6]">Data Kriteria</Link>
          <Link href="/admin/kandungan" className="block p-3 rounded-md hover:bg-[#fff0f6]">Data Kandungan</Link>
          <Link href="/admin/produk" className="block p-3 rounded-md hover:bg-[#fff0f6]">Data Produk</Link>
          <button onClick={logout} className="mt-6 p-2 rounded-md bg-[#FF7FA5] text-white">Logout</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
