"use client";

import { useState } from "react";
import AdminLayout from "../AdminLayout";

// Definisikan warna konsisten dengan AdminLayout
const COLORS = {
  bgMain: "bg-[#F4F7F2]",
  greenText: "#2F4F3A",
  hoverBg: "hover:bg-[#DDE6D5]",
  asideBorder: "border-[#C8D3BE]",
  divider: "border-[#E6EDE1]",
};

export default function PerhitunganPage() {
  const [formData, setFormData] = useState({
    c1: "",
    c2: "",
    c3: "",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Token admin tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API}/admin/perhitungan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          c1: formData.c1,
          c2: formData.c2,
          c3: formData.c3,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Error fetching calculation:", err);
      setError("Gagal memproses perhitungan. Pastikan backend tersedia dan parameter valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: COLORS.greenText }}>
          Uji Coba Perhitungan TOPSIS
        </h1>

        {/* Form Input */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-6" style={{ color: COLORS.greenText }}>
            Input Parameter Perhitungan
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.greenText }}>
                  C1: Jenis Kulit
                </label>
                <select
                  name="c1"
                  value={formData.c1}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Pilih Jenis Kulit</option>
                  <option value="Berminyak">Berminyak</option>
                  <option value="Kering">Kering</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.greenText }}>
                  C2: Jenis Jerawat
                </label>
                <select
                  name="c2"
                  value={formData.c2}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Pilih Jenis Jerawat</option>
                  <option value="Komedo">Komedo</option>
                  <option value="Papula">Papula</option>
                  <option value="Pustula">Pustula</option>
                  <option value="Nodul">Nodul</option>
                  <option value="Kistik">Kistik</option>
                  <option value="Jerawat Jamur">Jerawat Jamur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.greenText }}>
                  C3: Tingkat Keparahan
                </label>
                <select
                  name="c3"
                  value={formData.c3}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Pilih Tingkat Keparahan</option>
                  <option value="Ringan">Ringan</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Berat">Berat</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white p-3 rounded-lg transition-all duration-200 font-semibold shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 transform hover:scale-105"
              }`}
              style={{ backgroundColor: loading ? undefined : COLORS.greenText }}
            >
              {loading ? "Memproses..." : "Proses"}
            </button>
          </form>
        </div>

        {/* Pesan Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Hasil Perhitungan */}
        {results && (
          <div className="space-y-10">
            {/* Tabel 1: Data Awal Kandungan */}
            <Section title="1. Data Awal Kandungan">
              <Table
                headers={["Nama Kandungan", "C1", "C2", "C3", "C4"]}
                rows={results.dataAwal.map((d) => [d.nama_kandungan, d.c1, d.c2, d.c3, d.c4])}
              />
            </Section>

            {/* Tabel 2: Matriks Keputusan */}
            <Section title="2. Matriks Keputusan">
              <Table
                headers={["Alternatif", "C1", "C2", "C3", "C4"]}
                rows={results.matriksKeputusan.map((d) => [d.nama_kandungan, d.c1, d.c2, d.c3, d.c4])}
              />
            </Section>

            {/* Tabel 3: Matriks Ternormalisasi */}
            <Section title="3. Matriks Ternormalisasi">
              <Table
                headers={["Alternatif", "C1", "C2", "C3", "C4"]}
                rows={results.matriksNormalisasi.map((d) => [d.nama_kandungan, d.c1, d.c2, d.c3, d.c4])}
              />
            </Section>

            {/* Tabel 4: Matriks Ternormalisasi Berbobot */}
            <Section title="4. Matriks Ternormalisasi Berbobot">
              <Table
                headers={["Alternatif", "V1", "V2", "V3", "V4"]}
                rows={results.matriksBerbobot.map((d) => [d.nama_kandungan, d.v1, d.v2, d.v3, d.v4])}
              />
            </Section>

            {/* Tabel 5: Solusi Ideal */}
            <Section title="5. Solusi Ideal Positif (A+) & Negatif (A-)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold mb-4 text-green-800">A+ (Solusi Ideal Positif)</h3>
                  <ul className="space-y-2">
                    {results.solusiIdeal.aPlus.map((v, i) => (
                      <li key={i} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                        <span className="font-medium">C{i + 1}:</span>
                        <span className="text-green-600 font-semibold">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="font-semibold mb-4 text-red-800">A- (Solusi Ideal Negatif)</h3>
                  <ul className="space-y-2">
                    {results.solusiIdeal.aMinus.map((v, i) => (
                      <li key={i} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                        <span className="font-medium">C{i + 1}:</span>
                        <span className="text-red-600 font-semibold">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            {/* Tabel 6: Jarak ke Solusi Ideal */}
            <Section title="6. Jarak ke Solusi Ideal">
              <Table
                headers={["Alternatif", "D+", "D-"]}
                rows={results.jarak.map((d) => [d.nama_kandungan, d.d_plus, d.d_minus])}
              />
            </Section>

            {/* Tabel 7: Nilai Preferensi & Ranking */}
            <Section title="7. Nilai Preferensi & Ranking">
              <Table
                headers={["Alternatif", "Skor (Ci)", "Ranking"]}
                rows={results.preferensi.map((d) => [d.nama_kandungan, d.ci, d.ranking])}
              />
            </Section>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Section({ title, children }) {
  return (
    <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-6" style={{ color: "#2F4F3A" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full bg-white">
        <thead className="bg-gradient-to-r from-green-50 to-green-100">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="border-b border-gray-300 px-6 py-4 text-left font-semibold text-gray-800">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`hover:bg-gray-50 transition-colors duration-150 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
              {r.map((c, j) => (
                <td key={j} className="border-b border-gray-200 px-6 py-4 text-gray-700">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
