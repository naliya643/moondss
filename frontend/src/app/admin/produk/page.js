"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ProdukPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const emptyForm = {
    nama: "",
    harga: "",
    kandungan: "",
    deskripsi: "",
    foto: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/produk`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const j = await res.json();
      setList(Array.isArray(j) ? j : j.data ?? []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredList = list.filter((p) =>
    (p.nama || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleAdd(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v !== null && fd.append(k, v));

    const res = await fetch(`${API}/admin/produk`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });

    if (res.ok) {
      setIsAddOpen(false);
      setForm(emptyForm);
      fetchAll();
    } else alert("Gagal tambah produk");
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(editForm).forEach(([k, v]) => v !== null && fd.append(k, v));

    const res = await fetch(`${API}/admin/produk/${editingId}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });

    if (res.ok) {
      setIsEditOpen(false);
      fetchAll();
    } else alert("Gagal update");
  }

  async function handleDelete(id) {
    if (!confirm("Hapus produk ini?")) return;
    await fetch(`${API}/admin/produk/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    fetchAll();
  }

  function openEdit(p) {
    setEditingId(p.id);
    setEditForm({
      nama: p.nama,
      harga: p.harga,
      kandungan: p.kandungan,
      deskripsi: p.deskripsi,
      foto: null,
    });
    setIsEditOpen(true);
  }

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2F4F3A]">Data Produk</h1>
          <p className="text-sm text-gray-500">
            Total: {filteredList.length} data
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* 🔍 SEARCH BAR PERSIS KAYA KANDUNGAN */}
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-[#2F4F3A] transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 bg-[#2F4F3A] text-white rounded-lg hover:bg-green-800 transition font-semibold shadow-sm text-sm"
            >
              + Tambah
            </button>
            <button
              onClick={fetchAll}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border">
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-[#2F4F3A]">
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">Nama</th>
              <th className="p-4">Harga</th>
              <th className="p-4">Kandungan</th>
              <th className="p-4">Foto</th>
              <th className="p-4">Deskripsi</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400">
                  Memuat data...
                </td>
              </tr>
            ) : filteredList.length > 0 ? (
              filteredList.map((p, i) => (
                <tr key={p.id} className="border-b hover:bg-green-50/30">
                  <td className="p-4">{i + 1}</td>
                  <td className="p-4 font-semibold">{p.nama}</td>
                  <td className="p-4">Rp {p.harga}</td>
                  <td className="p-4">{p.kandungan}</td>
                  <td className="p-4">
                    {p.foto && (
                      <img
                        src={`${API}/uploads/${p.foto}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="p-4 truncate max-w-xs">
                    {p.deskripsi}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400">
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL ADD & EDIT (CRUD TETAP) */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={isAddOpen ? handleAdd : handleUpdate}
            className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-3"
          >
            {["nama", "harga", "kandungan"].map((f) => (
              <input
                key={f}
                placeholder={f}
                value={isAddOpen ? form[f] : editForm[f]}
                onChange={(e) =>
                  isAddOpen
                    ? setForm({ ...form, [f]: e.target.value })
                    : setEditForm({ ...editForm, [f]: e.target.value })
                }
                className="w-full p-2.5 border rounded-lg"
              />
            ))}

            <textarea
              placeholder="deskripsi"
              value={isAddOpen ? form.deskripsi : editForm.deskripsi}
              onChange={(e) =>
                isAddOpen
                  ? setForm({ ...form, deskripsi: e.target.value })
                  : setEditForm({ ...editForm, deskripsi: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg"
            />

            <input
              type="file"
              onChange={(e) =>
                isAddOpen
                  ? setForm({ ...form, foto: e.target.files[0] })
                  : setEditForm({
                      ...editForm,
                      foto: e.target.files[0],
                    })
              }
            />

            <div className="flex gap-3 pt-4 border-t">
              <button className="flex-1 bg-[#2F4F3A] text-white py-2 rounded-lg font-bold">
                Simpan
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setIsEditOpen(false);
                }}
                className="flex-1 bg-gray-100 py-2 rounded-lg font-bold"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
