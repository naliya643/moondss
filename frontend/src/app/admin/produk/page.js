"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ProdukPage() {
  const [list, setList] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [diagnostics, setDiagnostics] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian

  const [form, setForm] = useState({
    nama: "",
    harga: "",
    kandungan: "",
    foto: null,
    deskripsi: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [currentEditForm, setCurrentEditForm] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    fetchAll();
  }, []);

  // Logika Filter Produk
  const filteredList = (list || []).filter((p) =>
    p.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function fetchAll() {
    const candidateBases = [API, "http://127.0.0.1:8000", "http://localhost:8000"];
    const attempts = [];
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    async function tryFetch(url) {
      try {
        const res = await fetch(url, options);
        let body;
        try { body = await res.json(); } catch (err) { body = await res.text(); }
        return { ok: true, status: res.status, body, url };
      } catch (err) {
        return { ok: false, error: err.message || String(err), url };
      }
    }

    let finalList = [];
    for (const base of candidateBases) {
      const url = `${base.replace(/\/+$/, "")}/admin/produk`;
      const result = await tryFetch(url);
      attempts.push(result);

      if (result.ok && result.status >= 200 && result.status < 300) {
        const j = result.body;
        if (Array.isArray(j)) finalList = j;
        else if (j && Array.isArray(j.data)) finalList = j.data;
        break;
      }
    }

    if (finalList.length > 0) {
      setList(finalList);
      setFetchError(null);
      setDiagnostics(attempts);
    } else {
      setList([]);
      setFetchError("Gagal mengambil data produk.");
      setDiagnostics(attempts);
    }
  }

  // ... (handleAdd, handleDelete, startEdit, cancelEdit, handleUpdate tetap sama)
  async function handleAdd(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("nama", form.nama);
    fd.append("harga", form.harga);
    fd.append("kandungan", form.kandungan);
    fd.append("deskripsi", form.deskripsi);
    if (form.foto) fd.append("foto", form.foto);

    try {
      const options = token
        ? { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd }
        : { method: "POST", body: fd };
      const res = await fetch(`${API}/admin/produk`, options);

      if (res.ok) {
        setForm({ nama: "", harga: "", kandungan: "", foto: null, deskripsi: "" });
        const fileInput = document.getElementById("file-input-produk");
        if (fileInput) fileInput.value = null;
        setShowAddForm(false);
        fetchAll();
      } else {
        const j = await res.json();
        alert(j.detail || "Gagal tambah produk");
      }
    } catch (err) { alert("Gagal terhubung ke API."); }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus produk?")) return;
    try {
      const options = token
        ? { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        : { method: "DELETE" };
      const res = await fetch(`${API}/admin/produk/${id}`, options);
      if (res.ok) fetchAll();
      else {
        const j = await res.json();
        alert(j.detail || "Gagal hapus produk.");
      }
    } catch (e) { alert("Gagal terhubung ke API."); }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setCurrentEditForm({
      id: product.id,
      nama: product.nama,
      harga: product.harga,
      kandungan: product.kandungan,
      deskripsi: product.deskripsi,
      foto: null,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setCurrentEditForm(null);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingId) return;
    const fd = new FormData();
    fd.append("nama", currentEditForm.nama);
    fd.append("harga", currentEditForm.harga);
    fd.append("kandungan", currentEditForm.kandungan);
    fd.append("deskripsi", currentEditForm.deskripsi);
    if (currentEditForm.foto) fd.append("foto", currentEditForm.foto);

    try {
      const options = token
        ? { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: fd }
        : { method: "PUT", body: fd };
      const res = await fetch(`${API}/admin/produk/${editingId}`, options);
      if (res.ok) { cancelEdit(); fetchAll(); } 
      else {
        const j = await res.json();
        alert(j.detail || "Gagal update produk");
      }
    } catch (err) { alert("Gagal terhubung ke API."); }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2F4F3A]">Data Produk</h1>
          <p className="text-sm text-gray-500">Menampilkan {filteredList.length} produk</p>
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
              placeholder="Cari nama produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-sm text-sm"
            />
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#2F4F3A] text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-semibold shadow-sm text-sm"
          >
            {showAddForm ? "Tutup Form" : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Tambah Produk
              </>
            )}
          </button>
        </div>
      </div>

      {/* MODAL FORM EDIT */}
      {editingId && currentEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h2 className="text-xl font-bold text-[#2F4F3A]">Edit Produk</h2>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Nama Produk</label>
                  <input className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" value={currentEditForm.nama} onChange={(e) => setCurrentEditForm({ ...currentEditForm, nama: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Harga</label>
                    <input className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" type="number" value={currentEditForm.harga} onChange={(e) => setCurrentEditForm({ ...currentEditForm, harga: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Kandungan</label>
                    <input className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" value={currentEditForm.kandungan} onChange={(e) => setCurrentEditForm({ ...currentEditForm, kandungan: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Deskripsi</label>
                  <textarea rows="3" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" value={currentEditForm.deskripsi} onChange={(e) => setCurrentEditForm({ ...currentEditForm, deskripsi: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Ganti Foto (Opsional)</label>
                  <input type="file" accept="image/*" onChange={(e) => setCurrentEditForm({ ...currentEditForm, foto: e.target.files[0] })} className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700" />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button type="submit" className="flex-1 py-2.5 bg-[#2F4F3A] text-white rounded-lg font-bold hover:bg-green-800 transition shadow-md">Simpan Perubahan</button>
                  <button type="button" onClick={cancelEdit} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition">Batal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FORM TAMBAH */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-[#2F4F3A] mb-4">Tambah Produk Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input className="p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition" placeholder="Nama Produk" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
            <input className="p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition" placeholder="Harga" type="number" value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })} required />
            <input className="p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition" placeholder="Kandungan" value={form.kandungan} onChange={(e) => setForm({ ...form, kandungan: e.target.value })} required />
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, foto: e.target.files[0] })} id="file-input-produk" className="p-1 border rounded-lg text-sm bg-gray-50" />
          </div>
          <textarea className="w-full p-2.5 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-green-500 transition" placeholder="Deskripsi" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
          <button className="px-6 py-2.5 bg-[#2F4F3A] text-white rounded-lg font-bold hover:bg-green-700 transition shadow-sm">Tambah Produk</button>
        </form>
      )}

      {/* TABEL PRODUK */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-[#2F4F3A]">
            <tr className="text-left font-semibold">
              <th className="p-4">#</th>
              <th className="p-4">Nama</th>
              <th className="p-4">Kandungan</th>
              <th className="p-4">Harga</th>
              <th className="p-4">Foto</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? filteredList.map((p, i) => (
              <tr key={p.id || i} className="border-b hover:bg-green-50/20 transition">
                <td className="p-4 text-gray-500">{i + 1}</td>
                <td className="p-4 font-semibold text-gray-800">{p.nama}</td>
                <td className="p-4 text-gray-600">{p.kandungan || '-'}</td>
                <td className="p-4 font-mono text-green-700 font-bold text-base">Rp {Number(p.harga).toLocaleString()}</td>
                <td className="p-4">
                  {p.foto ? (
                    <img src={`${API}${String(p.foto).replace(/\\/g, '/').replace(/^\/+/, '/')}`} className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-200" alt="" />
                  ) : <div className="w-12 h-12 bg-gray-100 rounded-lg border border-dashed flex items-center justify-center text-[10px] text-gray-400 text-center px-1">No Pic</div>}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => startEdit(p)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 transition shadow-sm">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md hover:bg-red-600 transition shadow-sm">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="p-10 text-center text-gray-400">Data tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}