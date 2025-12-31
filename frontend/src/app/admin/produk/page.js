"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProdukPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  // ======================
  // GET ALL PRODUK
  // ======================
  async function fetchAll() {
    if (!token) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/admin/produk`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal fetch produk");

      const data = await res.json();
      setList(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data produk");
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  // ======================
  // DELETE PRODUK
  // ======================
  async function handleDelete(id) {
    if (!confirm("Yakin mau hapus produk ini?")) return;

    try {
      const res = await fetch(`${API}/admin/produk/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal hapus produk");

      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk");
    }
  }

  return (
    <AdminLayout title="Produk Skincare">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-[#2F4F3A] mb-4">
          Daftar Produk
        </h2>

        {loading && (
          <p className="text-sm text-gray-500 mb-3">Loading data...</p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-[#E6F9E6] text-[#2F4F3A]">
              <tr>
                <th className="border px-3 py-2">No</th>
                <th className="border px-3 py-2">Nama</th>
                <th className="border px-3 py-2">Harga</th>
                <th className="border px-3 py-2">Stok</th>
                <th className="border px-3 py-2">Foto</th>
                <th className="border px-3 py-2">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-400 py-6"
                  >
                    Belum ada data produk
                  </td>
                </tr>
              )}

              {list.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 text-center">
                    {i + 1}
                  </td>
                  <td className="border px-3 py-2">
                    {p.nama || p.nama_produk}
                  </td>
                  <td className="border px-3 py-2">
                    Rp {Number(p.harga).toLocaleString("id-ID")}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {p.stok}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {p.foto ? (
                      <img
                        src={`${API}${p.foto}`}
                        alt="foto produk"
                        className="w-14 h-14 object-cover rounded mx-auto"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border px-3 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
