import Link from "next/link";

const COLORS = {
  bgMain: "bg-[#F4F7F2]",       // Hijau muda Home
  arcColor: "bg-white",          // Lengkungan putih
  greenText: "#2F4F3A",          // Warna teks utama / judul
  buttonBg: "bg-[#DDE6D5]",      // Tombol background
  buttonHover: "hover:bg-[#C8D3BE]", // Hover tombol
  text: "#2F4F3A",               // Warna teks konten
};

export default function HasilPage() {
  return (
    <div className={`min-h-screen ${COLORS.bgMain} relative overflow-hidden`}>

      {/* Lengkungan putih */}
      <div
        className={`${COLORS.arcColor} w-full`}
        style={{
          height: "100vh",
          borderBottomLeftRadius: "50%",
          borderBottomRightRadius: "50%",
          transform: "scaleX(1.7)",
          position: "absolute",
          top: "-8vh",
          zIndex: 0,
        }}
      />

      {/* Konten utama */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center p-6">

        {/* Judul */}
        <h1
          className="text-2xl md:text-3xl font-bold mb-8"
          style={{ color: COLORS.greenText, fontFamily: "Segoe UI, Arial, sans-serif" }}
        >
          Kandungan Skincare Paling Direkomendasikan Untukmu!
        </h1>

        {/* Kartu hasil */}
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
          <p
            className="font-semibold text-lg mb-3"
            style={{ color: COLORS.greenText, fontFamily: "Segoe UI, Arial, sans-serif" }}
          >
            Kandungan Paling Direkomendasikan:
          </p>
          <p className="text-gray-800 text-xl font-semibold mb-6">
            Panthenol
          </p>

          <p
            className="font-semibold text-lg mb-3"
            style={{ color: COLORS.greenText, fontFamily: "Segoe UI, Arial, sans-serif" }}
          >
            Saran Produk:
          </p>
          <p className="text-gray-800 text-xl font-semibold mb-6">
            Skintific Panthenol Moisturizer
          </p>

          <p
            className="font-semibold text-lg mb-3"
            style={{ color: COLORS.greenText, fontFamily: "Segoe UI, Arial, sans-serif" }}
          >
            Perkiraan Harga:
          </p>
          <p className="text-gray-800 text-xl font-semibold">
            Rp120.000,00
          </p>
        </div>

        {/* Tombol ulang analisis */}
        <Link
          href="/analisis"
          className={`mt-6 px-10 py-3 rounded-full text-base shadow-md transition ${COLORS.buttonBg} ${COLORS.buttonHover}`}
          style={{
            fontFamily: "Segoe UI, Arial, sans-serif",
            fontWeight: 600,
            color: COLORS.greenText,
          }}
        >
          Ulang Analisis
        </Link>
      </main>
    </div>
  );
}
