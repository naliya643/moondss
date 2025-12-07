"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

// Pastikan URL API ini benar (sesuai port FastAPI kamu)
const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ProdukPage() {
  const [list, setList] = useState([]);
  
  // 🛑 STATE UNTUK TAMBAH PRODUK 🛑
  const [form, setForm] = useState({ 
    nama: "", 
    harga: "", 
    kandungan: "", 
    foto: null, 
    deskripsi: "" 
  });
  
  // 🛑 STATE UNTUK EDIT PRODUK 🛑
  const [editingId, setEditingId] = useState(null); 
  // State untuk menampung data produk yang sedang diedit
  const [currentEditForm, setCurrentEditForm] = useState(null); 

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(()=>{ fetchAll(); },[]);

  // ----------------------------------------------------
  // FUNGSI UTAMA
  // ----------------------------------------------------

  async function fetchAll() {
    try {
      const res = await fetch(`${API}/admin/produk`, { 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      });
      const j = await res.json();
      
      let fetchedList = [];
      if (res.ok) {
        // Handle jika API mengembalikan array langsung atau object dengan properti 'data'
        if (Array.isArray(j.data)) {
          fetchedList = j.data;
        } else if (Array.isArray(j)) {
          fetchedList = j;
        }
      } else {
        console.error("Fetch Produk Gagal:", j);
        alert(j.detail || "Gagal mengambil data produk.");
      }
      setList(fetchedList);
      
    } catch (e) {
      console.error("Koneksi gagal saat fetch produk:", e);
      // Di sini biasanya muncul alert "Gagal terhubung ke API"
      setList([]);
    }
  }

  // ----------------------------------------------------
  // CREATE (TAMBAH)
  // ----------------------------------------------------
  async function handleAdd(e) {
    e.preventDefault();
    
    // Gunakan FormData karena ada file (foto)
    const fd = new FormData();
    fd.append("nama", form.nama);
    fd.append("harga", form.harga);
    fd.append("kandungan", form.kandungan);
    fd.append("deskripsi", form.deskripsi);
    if (form.foto) fd.append("foto", form.foto);

    try {
      const res = await fetch(`${API}/admin/produk`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (res.ok) { 
        // Reset form
        setForm({ nama: "", harga: "", kandungan: "", foto: null, deskripsi: "" }); 
        document.getElementById('file-input-produk').value = null; // Reset input file
        fetchAll(); 
      }
      else { 
        const j = await res.json(); 
        alert(j.detail || "Gagal tambah produk"); 
      }
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke API saat menambah produk.");
    }
  }

  // ----------------------------------------------------
  // DELETE (HAPUS)
  // ----------------------------------------------------
  async function handleDelete(id) {
    if (!confirm("Hapus produk?")) return;
    try {
      const res = await fetch(`${API}/admin/produk/${id}`, { 
        method: "DELETE", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (res.ok) {
        fetchAll();
      } else {
        const j = await res.json();
        alert(j.detail || "Gagal hapus produk.");
      }
    } catch (e) {
      console.error(e);
      alert("Gagal terhubung ke API saat menghapus produk.");
    }
  }

  // ----------------------------------------------------
  // UPDATE (EDIT)
  // ----------------------------------------------------
  function startEdit(product) {
    setEditingId(product.id);
    // Isi form edit dengan data produk yang diklik
    setCurrentEditForm({
      id: product.id,
      nama: product.nama,
      harga: product.harga,
      kandungan: product.kandungan,
      deskripsi: product.deskripsi,
      // Foto di-set null, user harus upload baru jika ingin ganti
      foto: null 
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
    // Gunakan currentEditForm untuk update
    fd.append("nama", currentEditForm.nama);
    fd.append("harga", currentEditForm.harga);
    fd.append("kandungan", currentEditForm.kandungan);
    fd.append("deskripsi", currentEditForm.deskripsi);
    // Cek apakah ada file baru yang dipilih untuk diupload
    if (currentEditForm.foto) fd.append("foto", currentEditForm.foto);
    
    try {
      const res = await fetch(`${API}/admin/produk/${editingId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (res.ok) { 
        cancelEdit(); // Tutup form edit
        fetchAll(); // Refresh data
      }
      else { 
        const j = await res.json(); 
        alert(j.detail || "Gagal update produk"); 
      }
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke API saat memperbarui produk.");
    }
  }


  // ----------------------------------------------------
  // JSX RENDER
  // ----------------------------------------------------
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#FF7FA5] mb-6">Data Produk</h1>

      {/* 1. FORM TAMBAH PRODUK */}
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-bold text-[#FF7FA5] mb-4">Tambah Produk Baru</h2>
        <input className="w-full p-2 border rounded mb-2" placeholder="Nama Produk" value={form.nama} onChange={(e)=>setForm({...form,nama:e.target.value})} required />
        <input className="w-full p-2 border rounded mb-2" placeholder="Harga" type="number" value={form.harga} onChange={(e)=>setForm({...form,harga:e.target.value})} required />

        <input 
            className="w-full p-2 border rounded mb-2" 
            placeholder="Kandungan (Ketik nama kandungan)" 
            value={form.kandungan} 
            onChange={(e)=>setForm({...form,kandungan:e.target.value})} 
            required 
        />
        <textarea className="w-full p-2 border rounded mb-2" placeholder="Deskripsi" value={form.deskripsi} onChange={(e)=>setForm({...form,deskripsi:e.target.value})} />

        {/* INPUT FILE FOTO (DENGAN STYLE AGAR TERLIHAT) */}
        <div className="mb-4">
          <label htmlFor="file-input-produk" className="block text-sm font-medium text-gray-700 mb-1">
            Foto Produk (Opsional)
          </label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e)=>setForm({...form,foto:e.target.files[0]})} 
            id="file-input-produk"
            // --- STYLE AGAR TERLIHAT JELAS ---
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-pink-50 file:text-[#FF7FA5]
              hover:file:bg-pink-100"
            // ---------------------------------
          />
        </div>
        <button className="px-4 py-2 bg-[#FF7FA5] text-white rounded">Tambah Produk</button>
      </form>

      {/* 2. FORM EDIT PRODUK (TAMPIL JIKA editingId ADA) */}
      {editingId && currentEditForm && (
        <form onSubmit={handleUpdate} className="bg-yellow-50 p-6 rounded-xl shadow-lg mb-6 border-2 border-yellow-400">
          <h2 className="text-xl font-bold text-yellow-700 mb-4">Edit Produk ID: {editingId}</h2>
          
          <input 
            className="w-full p-2 border rounded mb-2" 
            placeholder="Nama Produk" 
            value={currentEditForm.nama} 
            onChange={(e)=>setCurrentEditForm({...currentEditForm,nama:e.target.value})} 
            required 
          />
          <input 
            className="w-full p-2 border rounded mb-2" 
            placeholder="Harga" 
            type="number" 
            value={currentEditForm.harga} 
            onChange={(e)=>setCurrentEditForm({...currentEditForm,harga:e.target.value})} 
            required 
          />
          <input 
            className="w-full p-2 border rounded mb-2" 
            placeholder="Kandungan" 
            value={currentEditForm.kandungan} 
            onChange={(e)=>setCurrentEditForm({...currentEditForm,kandungan:e.target.value})} 
            required 
          />
          <textarea 
            className="w-full p-2 border rounded mb-2" 
            placeholder="Deskripsi" 
            value={currentEditForm.deskripsi} 
            onChange={(e)=>setCurrentEditForm({...currentEditForm,deskripsi:e.target.value})} 
          />
          
          <p className="text-sm text-gray-500 mb-2">Ganti Foto (Opsional):</p>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e)=>setCurrentEditForm({...currentEditForm,foto:e.target.files[0]})} 
            className="mb-3" 
          />

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-yellow-600 text-white rounded">Simpan Perubahan</button>
            <button type="button" onClick={cancelEdit} className="px-4 py-2 bg-gray-400 text-white rounded">Batal</button>
          </div>
        </form>
      )}


      {/* 3. TABEL DATA PRODUK */}
      <div className="bg-white rounded-xl shadow p-3">
        <table className="w-full">
          <thead className="bg-[#FFE8F0] text-[#FF7FA5]">
            <tr><th className="p-2">#</th><th>Nama</th><th>Kandungan</th><th>Harga</th><th>Foto</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {Array.isArray(list) && list.map((p,i)=>(
              <tr key={p.id || i} className="border-b text-sm">
                <td className="p-2">{i+1}</td>
                <td className="p-2">{p.nama}</td>
                <td className="p-2">{p.kandungan || '-'}</td> 
                <td className="p-2">{p.harga}</td>
                <td className="p-2">
                  {/* URL API digabung dengan path foto dari DB */}
                  {p.foto ? <img src={`${API}${p.foto}`} alt={p.nama} className="w-14 h-14 object-cover rounded" /> : "-"}
                </td>
                <td className="p-2">
                    <button onClick={()=>startEdit(p)} className="text-blue-500 mr-2">Edit</button>
                    <button onClick={()=>handleDelete(p.id)} className="text-red-500">Hapus</button>
                </td>
              </tr>
            ))}
            {Array.isArray(list) && list.length === 0 && (
                <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                        Tidak ada data produk.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}