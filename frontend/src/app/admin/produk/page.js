"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ProdukPage() {
  const [list, setList] = useState([]);
  const [kandList, setKandList] = useState([]);
  const [form, setForm] = useState({ nama: "", harga: "", kandungan: "", foto: null, deskripsi: "" });
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(()=>{ fetchAll(); fetchKand(); },[]);

  async function fetchAll() {
    const res = await fetch(`${API}/admin/produk`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    const j = await res.json();
    setList(j.data || j || []);
  }

  async function fetchKand() {
    const res = await fetch(`${API}/admin/kandungan`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    const j = await res.json();
    setKandList(j.data || j || []);
  }

  async function handleAdd(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("nama", form.nama);
    fd.append("harga", form.harga);
    fd.append("kandungan", form.kandungan);
    fd.append("deskripsi", form.deskripsi);
    if (form.foto) fd.append("foto", form.foto);

    const res = await fetch(`${API}/admin/produk`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    if (res.ok) { setForm({ nama: "", harga: "", kandungan: "", foto: null, deskripsi: "" }); fetchAll(); }
    else { const j = await res.json(); alert(j.detail || "Gagal tambah produk"); }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus produk?")) return;
    await fetch(`${API}/admin/produk/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchAll();
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#FF7FA5] mb-6">Data Produk</h1>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow mb-6">
        <input className="w-full p-2 border rounded mb-2" placeholder="Nama Produk" value={form.nama} onChange={(e)=>setForm({...form,nama:e.target.value})} required />
        <input className="w-full p-2 border rounded mb-2" placeholder="Harga" type="number" value={form.harga} onChange={(e)=>setForm({...form,harga:e.target.value})} required />

        <select className="w-full p-2 border rounded mb-2" value={form.kandungan} onChange={(e)=>setForm({...form,kandungan:e.target.value})} required>
          <option value="">-- Pilih Kandungan --</option>
          {kandList.map(k=> <option key={k.id} value={k.nama}>{k.nama}</option>)}
        </select>

        <textarea className="w-full p-2 border rounded mb-2" placeholder="Deskripsi" value={form.deskripsi} onChange={(e)=>setForm({...form,deskripsi:e.target.value})} />

        <input type="file" accept="image/*" onChange={(e)=>setForm({...form,foto:e.target.files[0]})} className="mb-3" />

        <button className="px-4 py-2 bg-[#FF7FA5] text-white rounded">Tambah Produk</button>
      </form>

      <div className="bg-white rounded-xl shadow p-3">
        <table className="w-full">
          <thead className="bg-[#FFE8F0] text-[#FF7FA5]">
            <tr><th className="p-2">#</th><th>Nama</th><th>Kandungan</th><th>Harga</th><th>Foto</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {list.map((p,i)=>(
              <tr key={p.id || i} className="border-b text-sm">
                <td className="p-2">{i+1}</td>
                <td className="p-2">{p.nama}</td>
                <td className="p-2">{p.kandungan}</td>
                <td className="p-2">{p.harga}</td>
                <td className="p-2">{p.foto ? <img src={`${API}${p.foto}`} className="w-14 h-14 rounded" /> : "-"}</td>
                <td className="p-2"><button onClick={()=>handleDelete(p.id)} className="text-red-500">Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
