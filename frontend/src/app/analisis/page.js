"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const COLORS = {
  textAccent: "#2F4F3A",    // hijau elegan untuk judul & aksen
};

export default function AnalisisPage() {
  const router = useRouter();

  const [data, setData] = useState({
    skin_type: "",
    acne_type: "",
    acne_severity: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/hasil");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ fontFamily: "Segoe UI, Arial, sans-serif" }} // ubah font saja
    >
      {/* --- KONTEN UTAMA --- */}
      <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">

        {/* Judul */}
        <h1
          className="text-2xl md:text-3xl font-bold mb-12 mt-16"
          style={{ color: COLORS.textAccent }}
        >
          Bagaimana Kondisi Kulitmu?
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full max-w-sm">

          {/* Dropdown 1 */}
          <div className="relative">
            <select
              name="skin_type"
              value={data.skin_type}
              onChange={handleChange}
              className="w-full p-3 pl-6 pr-10 rounded-full text-lg shadow-md appearance-none cursor-pointer focus:ring-2"
              style={{
                backgroundColor: "#F4F7F2",
                color: "#3A5F47",
                border: "none"
              }}
              required
            >
              <option value="" disabled>Jenis Kulit</option>
              <option value="Normal">Normal</option>
              <option value="Kering">Kering</option>
              <option value="Berminyak">Berminyak</option>
              <option value="Kombinasi">Kombinasi</option>
            </select>

            <div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4"
              style={{ color: "#3A5F47" }}
            >
              ▼
            </div>
          </div>

          {/* Dropdown 2 */}
          <div className="relative">
            <select
              name="acne_type"
              value={data.acne_type}
              onChange={handleChange}
              className="w-full p-3 pl-6 pr-10 rounded-full text-lg shadow-md appearance-none cursor-pointer focus:ring-2"
              style={{
                backgroundColor: "#F4F7F2",
                color: "#3A5F47",
                border: "none"
              }}
              required
            >
              <option value="" disabled>Jenis Jerawat</option>
              <option value="komedo">Komedo</option>
              <option value="papula">Papula</option>
              <option value="pustula">Pustula</option>
              <option value="nodul">Nodul</option>
              <option value="kistik">Kistik</option>
            </select>

            <div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4"
              style={{ color: "#3A5F47" }}
            >
              ▼
            </div>
          </div>

          {/* Dropdown 3 */}
          <div className="relative">
            <select
              name="acne_severity"
              value={data.acne_severity}
              onChange={handleChange}
              className="w-full p-3 pl-6 pr-10 rounded-full text-lg shadow-md appearance-none cursor-pointer focus:ring-2"
              style={{
                backgroundColor: "#F4F7F2",
                color: "#3A5F47",
                border: "none"
              }}
              required
            >
              <option value="" disabled>Tingkat Keparahan</option>
              <option value="ringan">Ringan</option>
              <option value="sedang">Sedang</option>
              <option value="berat">Berat</option>
            </select>

            <div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4"
              style={{ color: "#3A5F47" }}
            >
              ▼
            </div>
          </div>

          {/* Tombol */}
          <button
            type="submit"
            className="mt-6 px-8 py-3 rounded-full text-lg font-bold shadow-lg transition"
            style={{
              backgroundColor: "#2F4F3A",
              color: "white",
              fontFamily: "Segoe UI, Arial, sans-serif",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1E3A2A")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2F4F3A")}
          >
            Lihat Hasil
          </button>
        </form>
      </main>
    </div>
  );
}
