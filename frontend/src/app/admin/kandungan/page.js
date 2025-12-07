"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function KandunganPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ 
    nama: "", 
    manfaat: "", 
    c1: "", 
    c2: "", 
    c3: "", 
    c4: "", 
    foto: null 
  });
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(()=>{ fetchAll(); },[]);

  // Perbaikan 1: Menggunakan try...catch dan Validasi Response API
  async function fetchAll() {
    try {
      const res = await fetch(`${API}/admin/kandungan`, { 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      });
      
      const j = await res.json();
      
      let fetchedList = [];
      
      if (!res.ok) {
        console.error("Fetch Gagal (Respon Server):", j);
        // Tampilkan error ke user (opsional)
        // alert(`Gagal memuat data: ${j.detail || "Terjadi kesalahan server."}`);
      } else {
        // Pastikan j.data atau j adalah Array
        if (Array.isArray(j.data)) {
          fetchedList = j.data;
        } else if (Array.isArray(j)) {
          fetchedList = j;
        }
      }
      
      setList(fetchedList); // List akan selalu Array atau Array kosong
      
    } catch (e) {
      console.error("Ada masalah saat fetching data (Koneksi):", e);
      // alert("Gagal terhubung ke API."); // Jika perlu notifikasi ke user
      setList([]); // Jamin list adalah Array kosong saat error koneksi
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    const fd = new FormData();
    // Gunakan parseFloat untuk data numerik (C1-C4), meskipun API yang handle, ini pencegahan
    fd.append("nama", form.nama);
    fd.append("manfaat", form.manfaat);
    fd.append("c1", form.c1 ? parseFloat(form.c1) : ""); 
    fd.append("c2", form.c2 ? parseFloat(form.c2) : "");
    fd.append("c3", form.c3 ? parseFloat(form.c3) : "");
    fd.append("c4", form.c4 ? parseFloat(form.c4) : "");
    if (form.foto) fd.append("foto", form.foto);

    try {
      const res = await fetch(`${API}/admin/kandungan`, {
        method: "POST",
        // Note: Header Content-Type: "application/json" TIDAK perlu/TIDAK boleh ada saat menggunakan FormData
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
  
      if (res.ok) { 
        setForm({ nama: "", manfaat: "", c1: "", c2: "", c3: "", c4: "", foto: null }); 
        // Reset input file secara manual
        document.getElementById('file-input-kandungan').value = null; 
        fetchAll(); 
      }
      else { 
        const j = await res.json(); 
        alert(j.detail || "Gagal tambah"); 
      }
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke API saat menambah data.");
    }
  }

  // Perbaikan 2: Menambahkan pengecekan res.ok untuk DELETE
  async function handleDelete(id) {
    if (!confirm("Hapus kandungan?")) return;
    try {
      const res = await fetch(`${API}/admin/kandungan/${id}`, { 
        method: "DELETE", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (res.ok) {
        fetchAll();
      } else {
        const j = await res.json();
        alert(j.detail || "Gagal hapus data.");
      }
    } catch (e) {
      console.error(e);
      alert("Gagal terhubung ke API saat menghapus data.");
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#FF7FA5] mb-6">Data Kandungan</h1>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow mb-6">
        <input className="w-full p-2 border rounded mb-2" placeholder="Nama Kandungan" value={form.nama} onChange={(e)=>setForm({...form,nama:e.target.value})} required />
        <textarea className="w-full p-2 border rounded mb-2" placeholder="Manfaat" value={form.manfaat} onChange={(e)=>setForm({...form,manfaat:e.target.value})} />
        <div className="grid grid-cols-4 gap-2 mb-2">
          {/* Ubah input C1-C4 ke type="number" untuk konsistensi data */}
          <input className="p-2 border rounded" type="number" step="0.01" placeholder="C1" value={form.c1} onChange={(e)=>setForm({...form,c1:e.target.value})} />
          <input className="p-2 border rounded" type="number" step="0.01" placeholder="C2" value={form.c2} onChange={(e)=>setForm({...form,c2:e.target.value})} />
          <input className="p-2 border rounded" type="number" step="0.01" placeholder="C3" value={form.c3} onChange={(e)=>setForm({...form,c3:e.target.value})} />
          <input className="p-2 border rounded" type="number" step="0.01" placeholder="C4" value={form.c4} onChange={(e)=>setForm({...form,c4:e.target.value})} />
        </div>

        <input 
          type="file" 
          accept="image/*" 
          onChange={(e)=>setForm({...form,foto:e.target.files[0]})} 
          className="mb-3" 
          id="file-input-kandungan" // Tambahkan ID untuk reset
        />

        <button className="px-4 py-2 bg-[#FF7FA5] text-white rounded">Tambah Kandungan</button>
      </form>

      <div className="bg-white rounded-xl shadow p-3">
        <table className="w-full">
          <thead className="bg-[#FFE8F0] text-[#FF7FA5]">
            <tr><th className="p-2">#</th><th>Nama</th><th>Manfaat</th><th>Foto</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {Array.isArray(list) && list.map((k,i)=>(
              <tr key={k.id || i} className="border-b text-sm">
                <td className="p-2">{i+1}</td>
                <td className="p-2">{k.nama}</td>
                <td className="p-2">{k.manfaat}</td>
                {/* Perbaiki tampilan foto agar lebih rapi */}
                <td className="p-2">
                  {k.foto ? <img src={`${API}${k.foto}`} alt={k.nama} className="w-12 h-12 object-cover rounded" /> : "-"}
                </td>
                <td className="p-2"><button onClick={()=>handleDelete(k.id)} className="text-red-500">Hapus</button></td>
              </tr>
            ))}
            {Array.isArray(list) && list.length === 0 && (
                <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                        Tidak ada data kandungan.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}