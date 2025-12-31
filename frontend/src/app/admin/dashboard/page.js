"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../AdminLayout";

// Definisikan warna yang diambil dari Home.js
const COLORS = {
  greenText: "#2F4F3A", // Warna teks utama, border, dan judul
  buttonBg: "bg-[#DDE6D5]", // Warna hover card
};

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    if (!token) router.push("/admin");
  }, [router]);

  return (
    <AdminLayout>
      {/* JUDUL */}
      <h1 className="text-3xl font-bold mb-4" style={{ color: COLORS.greenText }}>Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: Kelola Kriteria */}
        <a 
          href="/admin/kriteria"
          className={`p-6 bg-white rounded-xl shadow border cursor-pointer 
                      hover:${COLORS.buttonBg} transition duration-200 block`}
          style={{ borderColor: COLORS.greenText }} // Border
        >
          <h2 className="text-xl font-bold" style={{ color: COLORS.greenText }}>Lihat Kriteria</h2>
          <p className="mt-2 text-sm text-gray-600">Lihat kriteria untuk SPK.</p>
        </a>

        {/* CARD 2: Kelola Kandungan */}
        <a 
          href="/admin/kandungan"
          className={`p-6 bg-white rounded-xl shadow border cursor-pointer 
                      hover:${COLORS.buttonBg} transition duration-200 block`}
          style={{ borderColor: COLORS.greenText }} // Border
        >
          <h2 className="text-xl font-bold" style={{ color: COLORS.greenText }}>Kelola Kandungan</h2>
          <p className="mt-2 text-sm text-gray-600">Tambah/ubah alternatif (kandungan).</p>
        </a>

        {/* CARD 3: Kelola Produk */}
        <a 
          href="/admin/produk"
          className={`p-6 bg-white rounded-xl shadow border cursor-pointer 
                      hover:${COLORS.buttonBg} transition duration-200 block`}
          style={{ borderColor: COLORS.greenText }} // Border
        >
          <h2 className="text-xl font-bold" style={{ color: COLORS.greenText }}>Kelola Produk</h2>
          <p className="mt-2 text-sm text-gray-600">Tambah/ubah produk rekomendasi.</p>
        </a>
        
      </div>
    </AdminLayout>
  );
}