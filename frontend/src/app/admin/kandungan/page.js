"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function KandunganPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ nama: "", manfaat: "", c1: "", c2: "", c3: "", c4: "", foto: null });
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(()=>{ fetchAll(); },[]);

  async function fetchAll() {
    const res = await fetch(`${API}/admin/kandungan`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    const j = await res.json();
    setList(j.data || j || []);
  }

  async function handleAdd(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("nama", form.nama);
    fd.append("manfaat", form.manfaat);
    fd.append("c1", form.c1);
    fd.append("c2", form.c2);
    fd.append("c3", form.c3);
    fd.append("c4", form.c4);
    if (form.foto) fd.append("foto", form.foto);

    const res = await fetch(`${API}/admin/kandungan`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    if (res.ok) { setForm({ nama: "", manfaat: "", c1: "", c2: "", c3: "", c4: "", foto: null }); fetchAll(); }
    else { const j = await res.json(); alert(j.detail || "Gagal tambah"); }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus kandungan?")) return;
    await fetch(`${API}/admin/kandungan/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchAll();
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#FF7FA5] mb-6">Data Kandungan</h1>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow mb-6">
        <input className="w-full p-2 border rounded mb-2" placeholder="Nama Kandungan" value={form.nama} onChange={(e)=>setForm({...form,nama:e.target.value})} required />
        <textarea className="w-full p-2 border rounded mb-2" placeholder="Manfaat" value={form.manfaat} onChange={(e)=>setForm({...form,manfaat:e.target.value})} />
        <div className="grid grid-cols-4 gap-2 mb-2">
          <input className="p-2 border rounded" placeholder="C1" value={form.c1} onChange={(e)=>setForm({...form,c1:e.target.value})} />
          <input className="p-2 border rounded" placeholder="C2" value={form.c2} onChange={(e)=>setForm({...form,c2:e.target.value})} />
          <input className="p-2 border rounded" placeholder="C3" value={form.c3} onChange={(e)=>setForm({...form,c3:e.target.value})} />
          <input className="p-2 border rounded" placeholder="C4" value={form.c4} onChange={(e)=>setForm({...form,c4:e.target.value})} />
        </div>

        <input type="file" accept="image/*" onChange={(e)=>setForm({...form,foto:e.target.files[0]})} className="mb-3" />

        <button className="px-4 py-2 bg-[#FF7FA5] text-white rounded">Tambah Kandungan</button>
      </form>

      <div className="bg-white rounded-xl shadow p-3">
        <table className="w-full">
          <thead className="bg-[#FFE8F0] text-[#FF7FA5]">
            <tr><th className="p-2">#</th><th>Nama</th><th>Manfaat</th><th>Foto</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {list.map((k,i)=>(
              <tr key={k.id || i} className="border-b text-sm">
                <td className="p-2">{i+1}</td>
                <td className="p-2">{k.nama}</td>
                <td className="p-2">{k.manfaat}</td>
                <td className="p-2">{k.foto ? <img src={`${API}${k.foto}`} className="w-12 h-12 rounded" /> : "-"}</td>
                <td className="p-2"><button onClick={()=>handleDelete(k.id)} className="text-red-500">Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
