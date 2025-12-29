"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function KandunganPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State baru untuk pencarian

  // form state for add
  const emptyForm = {
    nama_kandungan: "",
    deskripsi: "",
    c1: "Normal",
    c2: "Komedo",
    c3: "Ringan",
    c4: 3,
  };
  const [form, setForm] = useState(emptyForm);
  const [actionLoading, setActionLoading] = useState(null); 

  // modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    fetchAll();
  }, []);

  // Filter list berdasarkan nama kandungan
  const filteredList = list.filter((item) =>
    item.nama_kandungan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function normalizeItem(item) {
    return {
      id: item.id,
      nama_kandungan: item.nama_kandungan ?? item.nama ?? item.nama_kandungan,
      deskripsi: item.deskripsi ?? item.manfaat ?? item.deskripsi ?? "",
      c1: item.c1 ?? "Normal",
      c2: item.c2 ?? "Komedo",
      c3: item.c3 ?? "Ringan",
      c4: item.c4 ?? 0,
    };
  }

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/kandungan`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const j = await res.json();
      let arr = [];
      if (res.ok) {
        const source = Array.isArray(j) ? j : j.data ?? j;
        arr = Array.isArray(source) ? source.map(normalizeItem) : [];
      }
      setList(arr);
    } catch (e) {
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e && e.preventDefault();
    const payload = { ...form, c4: Number(form.c4) };
    setActionLoading('add');
    try {
      const res = await fetch(`${API}/admin/kandungan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm(emptyForm);
        setIsAddOpen(false);
        fetchAll();
      } else {
        const j = await res.json();
        alert(j.detail || "Gagal tambah kandungan");
      }
    } catch (err) {
      alert("Gagal koneksi ke API");
    } finally { setActionLoading(null); }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus kandungan ini?")) return;
    try {
      const res = await fetch(`${API}/admin/kandungan/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) fetchAll();
    } catch (e) { alert("Gagal hapus"); }
  }

  function openEdit(item) {
    setEditingId(item.id);
    setEditForm({ ...item });
    setIsEditOpen(true);
  }

  async function handleUpdate(e) {
    e && e.preventDefault();
    const payload = { ...editForm, c4: Number(editForm.c4) };
    try {
      const res = await fetch(`${API}/admin/kandungan/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsEditOpen(false);
        fetchAll();
      }
    } catch (err) { alert("Gagal update"); }
  }

  const c1Options = ["Normal", "Kering", "Berminyak", "Kombinasi"];
  const c2Options = ["Komedo", "Papula", "Pustula", "Nodul", "Kistik", "Jerawat Jamur"];
  const c3Options = ["Ringan", "Sedang", "Berat"];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2F4F3A]">Data Kandungan</h1>
          <p className="text-sm text-gray-500">Total: {filteredList.length} data</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar Imut */}
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-[#2F4F3A] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cari kandungan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 bg-[#2F4F3A] text-white rounded-lg hover:bg-green-800 transition flex items-center gap-2 font-semibold shadow-sm text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Tambah
            </button>
            <button onClick={fetchAll} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm">
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-[#2F4F3A]">
            <tr className="text-left">
              <th className="p-4">#</th>
              <th className="p-4">Nama</th>
              <th className="p-4">Deskripsi</th>
              <th className="p-4 text-center">C1</th>
              <th className="p-4 text-center">C2</th>
              <th className="p-4 text-center">C3</th>
              <th className="p-4 text-center">C4</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-10 text-center text-gray-400">Memuat data...</td></tr>
            ) : filteredList.length > 0 ? (
              filteredList.map((k, i) => (
                <tr key={k.id || i} className="border-b hover:bg-green-50/30 transition">
                  <td className="p-4 text-gray-500">{i + 1}</td>
                  <td className="p-4 font-semibold text-gray-800">{k.nama_kandungan}</td>
                  <td className="p-4 text-gray-600 max-w-xs truncate">{k.deskripsi}</td>
                  <td className="p-4 text-center"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{k.c1}</span></td>
                  <td className="p-4 text-center"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{k.c2}</span></td>
                  <td className="p-4 text-center"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{k.c3}</span></td>
                  <td className="p-4 text-center font-bold text-green-700">{k.c4}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEdit(k)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 transition">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(k.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md hover:bg-red-600 transition">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={8} className="p-10 text-center text-gray-400">Data tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (Tetap sama) */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#2F4F3A]">
                {isAddOpen ? "Tambah Kandungan Baru" : "Edit Kandungan"}
              </h2>
              <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={isAddOpen ? handleAdd : handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Nama Kandungan</label>
                <input 
                  required 
                  value={isAddOpen ? form.nama_kandungan : editForm.nama_kandungan} 
                  onChange={(e) => isAddOpen ? setForm({...form, nama_kandungan: e.target.value}) : setEditForm({...editForm, nama_kandungan: e.target.value})} 
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Deskripsi</label>
                <textarea 
                  rows="3" 
                  value={isAddOpen ? form.deskripsi : editForm.deskripsi} 
                  onChange={(e) => isAddOpen ? setForm({...form, deskripsi: e.target.value}) : setEditForm({...editForm, deskripsi: e.target.value})} 
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-600">Jenis Kulit (C1)</label>
                  <select 
                    value={isAddOpen ? form.c1 : editForm.c1} 
                    onChange={(e) => isAddOpen ? setForm({...form, c1: e.target.value}) : setEditForm({...editForm, c1: e.target.value})} 
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    {c1Options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-600">Jenis Jerawat (C2)</label>
                  <select 
                    value={isAddOpen ? form.c2 : editForm.c2} 
                    onChange={(e) => isAddOpen ? setForm({...form, c2: e.target.value}) : setEditForm({...editForm, c2: e.target.value})} 
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    {c2Options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-600">Keparahan (C3)</label>
                  <select 
                    value={isAddOpen ? form.c3 : editForm.c3} 
                    onChange={(e) => isAddOpen ? setForm({...form, c3: e.target.value}) : setEditForm({...editForm, c3: e.target.value})} 
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    {c3Options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Efektivitas (C4: 1-5)</label>
                <input 
                  type="number" min={1} max={5} 
                  value={isAddOpen ? form.c4 : editForm.c4} 
                  onChange={(e) => isAddOpen ? setForm({...form, c4: e.target.value}) : setEditForm({...editForm, c4: e.target.value})} 
                  className="w-24 p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" className="flex-1 py-2.5 bg-[#2F4F3A] text-white rounded-lg font-bold hover:bg-green-800 transition">
                  {isAddOpen ? "Simpan Kandungan" : "Update Kandungan"}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} 
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}