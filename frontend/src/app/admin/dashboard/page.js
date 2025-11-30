"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../AdminLayout";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/login");
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#FF7FA5] mb-4">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow border border-[#FF7FA5]">
          <h2 className="text-xl font-bold text-[#FF7FA5]">Kelola Kriteria</h2>
          <p className="mt-2 text-sm text-gray-600">Tambah/ubah bobot kriteria TOPSIS.</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow border border-[#FF7FA5]">
          <h2 className="text-xl font-bold text-[#FF7FA5]">Kelola Kandungan</h2>
          <p className="mt-2 text-sm text-gray-600">Tambah/ubah alternatif (kandungan).</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow border border-[#FF7FA5]">
          <h2 className="text-xl font-bold text-[#FF7FA5]">Kelola Produk</h2>
          <p className="mt-2 text-sm text-gray-600">Tambah/ubah produk yang mengandung kandungan.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
