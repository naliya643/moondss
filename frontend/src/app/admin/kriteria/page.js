"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function KriteriaPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ kode: "", nama: "", bobot: "", jenis: "benefit" });
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    try {
      const res = await fetch(`${API}/admin/kriteria`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setList(data.data || data || []);
    } catch (e) { console.error(e); }
  }

  async function handleAdd(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/admin/kriteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) { setForm({ kode: "", nama: "", bobot: "", jenis: "benefit" }); fetchAll(); }
      else { const j = await res.json(); alert(j.detail || "Gagal tambah"); }
    } catch (err) { console.error(err); }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus kriteria?")) return;
    await fetch(`${API}/admin/kriteria/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchAll();
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#FF7FA5] mb-6">Data Kriteria</h1>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input placeholder="Kode (C1)" className="p-2 border rounded" value={form.kode} onChange={(e)=>setForm({...form,kode:e.target.value})} required />
          <input placeholder="Nama Kriteria" className="p-2 border rounded" value={form.nama} onChange={(e)=>setForm({...form,nama:e.target.value})} required />
          <input placeholder="Bobot" type="number" step="0.01" className="p-2 border rounded" value={form.bobot} onChange={(e)=>setForm({...form,bobot:parseFloat(e.target.value)})} required />
          <select className="p-2 border rounded" value={form.jenis} onChange={(e)=>setForm({...form,jenis:e.target.value})}>
            <option value="benefit">Benefit</option>
            <option value="cost">Cost</option>
          </select>
        </div>
        <button className="mt-3 px-4 py-2 bg-[#FF7FA5] text-white rounded">Tambah</button>
      </form>

      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full text-left">
          <thead className="bg-[#FFE8F0] text-[#FF7FA5]">
            <tr><th className="p-2">#</th><th>Kode</th><th>Nama</th><th>Bobot</th><th>Tipe</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {list.map((k, i) => (
              <tr key={k.id || i} className="border-b text-sm">
                <td className="p-2">{i+1}</td>
                <td className="p-2">{k.kode}</td>
                <td className="p-2">{k.nama}</td>
                <td className="p-2">{k.bobot}</td>
                <td className="p-2">{k.jenis}</td>
                <td className="p-2">
                  <button onClick={() => handleDelete(k.id)} className="text-red-500">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
