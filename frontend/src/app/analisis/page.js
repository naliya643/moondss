"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const COLORS = {
  textAccent: "#2F4F3A",
};

export default function AnalisisPage() {
  const router = useRouter();

  const [data, setData] = useState({
    skin_type: "",
    acne_type: "",
    acne_severity: "",
  });

  // handle change dengan guard logic (biar helper ga masuk TOPSIS)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "acne_type" && value === "__HELP__") {
      router.push("/info-jerawat");
      return; // stop di sini
    }

    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const payload = {
        c1: data.skin_type,
        c2: data.acne_type,
        c3: data.acne_severity,
      };

      const response = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || "Gagal melakukan analisis"}`);
        return;
      }

      const result = await response.json();
      localStorage.setItem("analysisResult", JSON.stringify(result));
      router.push("/hasil");
    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke server. Coba lagi.");
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "Segoe UI, Arial, sans-serif" }}
    >
      {/* KONTEN UTAMA */}
      <main className="flex flex-col items-center justify-start pt-20 px-6 text-center">

        {/* Judul */}
        <h1
          className="text-2xl md:text-3xl font-bold mb-8 -mt-13"
          style={{ color: COLORS.textAccent }}
        >
          Bagaimana Kondisi Kulitmu?
        </h1>

<button
  onClick={() => router.back()}
  className="
    fixed top-65 left-6 z-50
    w-10 h-10 rounded-full
    flex items-center justify-center
    bg-white text-[#2F4F3A]
    shadow-md
    transition-all duration-200 ease-out
    hover:scale-105
    hover:shadow-lg
    hover:bg-[#E6F9E6]
    active:scale-95
    group
  "
  aria-label="Kembali"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-200 group-hover:-translate-x-0.5"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
</button>


        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5 w-full max-w-sm">

          {/* Dropdown 1: Jenis Kulit */}
          <div className="relative">
            <select
              name="skin_type"
              value={data.skin_type}
              onChange={handleChange}
              className="w-full p-3 pl-6 pr-10 rounded-full text-base shadow-md appearance-none cursor-pointer focus:ring-2"
              style={{ backgroundColor: "#F4F7F2", color: "#3A5F47", border: "none" }}
              required
            >
              <option value="" disabled>Jenis Kulit</option>
              <option value="Normal">Normal</option>
              <option value="Kering">Kering</option>
              <option value="Berminyak">Berminyak</option>
              <option value="Kombinasi">Kombinasi</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4" style={{ color: "#3A5F47" }}>▼</div>
          </div>

          {/* Dropdown 2: Jenis Jerawat + Helper */}
          <div className="relative">
            <select
              name="acne_type"
              value={data.acne_type}
              onChange={handleChange}
              className="w-full p-3 pl-6 pr-10 rounded-full text-base shadow-md appearance-none cursor-pointer focus:ring-2"
              style={{ backgroundColor: "#F4F7F2", color: "#3A5F47", border: "none" }}
              required
            >
              <option value="" disabled>Jenis Jerawat</option>
              <option value="komedo">Komedo</option>
              <option value="papula">Papula</option>
              <option value="pustula">Pustula</option>
              <option value="nodul">Nodul</option>
              <option value="kistik">Kistik</option>
              <option value="Jerawat Jamur">Jerawat Jamur</option>

              {/* separator */}
              <option value="" disabled>──────────────</option>

              {/* helper */}
              <option
                value="__HELP__"
                style={{ color: "#2bdc18ff", fontWeight: "bold" }}
              >
                Bingung? Pelajari jerawatmu! →
              </option>            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 " style={{ color: "#3A5F47" }}>▼</div>
          </div>

          {/* Dropdown 3: Tingkat Keparahan */}
          <div className="relative">
            <select
              name="acne_severity"
              value={data.acne_severity}
              onChange={handleChange}
              className="w-full p-3 pl-6 pr-10 rounded-full text-base shadow-md appearance-none cursor-pointer focus:ring-2"
              style={{ backgroundColor: "#F4F7F2", color: "#3A5F47", border: "none" }}
              required
            >
              <option value="" disabled>Tingkat Keparahan</option>
              <option value="ringan">Ringan</option>
              <option value="sedang">Sedang</option>
              <option value="berat">Berat</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4" style={{ color: "#3A5F47" }}>▼</div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="mt-4 px-8 py-3 rounded-full text-base font-bold shadow-lg transition"
            style={{ backgroundColor: "#2F4F3A", color: "white" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1E3A2A")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2F4F3A")}
          >
            Lihat Hasil
          </button>
        </form>
      </main>
    </div>
  );
}
