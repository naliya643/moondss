"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COLORS = {
  bgMain: "bg-[#F4F7F2]",       // Hijau muda Home
  arcColor: "bg-white",        // Lengkungan putih
  greenText: "#2F4F3A",        // Warna teks utama / judul
  buttonBg: "bg-[#DDE6D5]",    // Tombol background
  buttonHover: "hover:bg-[#C8D3BE]",
  text: "#2F4F3A",
};

export default function HasilPage() {
  const [result, setResult] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const savedResult = localStorage.getItem("analysisResult");
    if (savedResult) {
      try {
        const parsedResult = JSON.parse(savedResult);
        setResult(parsedResult);

        if (parsedResult.nama) {
          fetchProdukByKandungan(parsedResult.nama);
        }
      } catch (err) {
        console.error("Error parsing saved result:", err);
      }
    }
  }, []);

  const fetchProdukByKandungan = async (kandungan) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API}/produk?kandungan=${encodeURIComponent(kandungan)}`
      );

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();
      const produkList = Array.isArray(data) ? data : data.data || [];
      setProducts(produkList);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${COLORS.bgMain} relative overflow-hidden`}>
      {/* ============================= */}
      {/* TOMBOL KELUAR + TEKS SELESAI */}
      {/* ============================= */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1">
        <span className="text-[12px] text-gray-430 tracking-wide opacity-50">
          selesai
        </span>

        <Link
          href="/"
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ${COLORS.buttonBg} ${COLORS.buttonHover} group`}
          title="Kembali ke Beranda"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke={COLORS.greenText}
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* BACKGROUND LENGKUNG */}
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

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1
          className="text-2xl md:text-3xl font-bold mb-8"
          style={{ color: COLORS.greenText }}
        >
          Kandungan Skincare Paling Direkomendasikan Untukmu!
        </h1>

        {result ? (
          <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
            {result.foto && (
              <img
                src={`${API}${result.foto}`}
                alt={result.nama}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
            )}

            <p className="text-green-800 text-xl font-semibold mb-2">
              {result.nama || "-"}
            </p>

            <p className="font-semibold text-lg mb-0" style={{ color: COLORS.greenText }}>
              Manfaat:
            </p>
            <p className="text-gray-600 text-sm mb-3">
              {result.deskripsi || "-"}
            </p>

            {/*
              Skor kesesuaian TOPSIS disembunyikan dari end user
              karena bersifat teknis dan berpotensi menimbulkan
              salah interpretasi klinis.
            */}
            {/*
            {result.skor && (
              <p className="text-sm text-green-600 font-medium">
                Skor Kesesuaian{" "}
                <span className="text-green-700 font-medium">
                  {(result.skor * 100).toFixed(2)}%
                </span>
              </p>
            )}
            */}
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
            <p className="text-gray-500">Loading hasil analisis...</p>
          </div>
        )}

        {result && products.length > 0 && (
          <div className="mt-12 w-full max-w-2xl">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: COLORS.greenText }}
            >
              Produk yang Mengandung {result.nama}
            </h2>

            <div
              className={`grid gap-6 ${
                products.length === 1
                  ? "grid-cols-1 justify-items-center"
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              {products.map((produk) => (
                <div
                  key={produk.id}
                  className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
                >
                  {produk.foto && (
                    <img
                      src={`${API}${produk.foto}`}
                      alt={produk.nama}
                      className="w-full max-h-50 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-green-800 text-xl font-semibold mb-2">
                    {produk.nama}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    {produk.deskripsi || "-"}
                  </p>
                  <p className="text-lg font-bold" style={{ color: COLORS.greenText }}>
                    Rp{produk.harga?.toLocaleString("id-ID") || "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && products.length === 0 && !loading && (
          <p className="mt-8 text-gray-500">
            Tidak ada produk yang mengandung {result.nama}
          </p>
        )}

        <Link
          href="/analisis"
          className={`mt-10 px-10 py-3 rounded-full text-base shadow-md transition ${COLORS.buttonBg} ${COLORS.buttonHover}`}
          style={{ color: COLORS.greenText, fontWeight: 600 }}
        >
          Ulang Analisis
        </Link>
      </main>
    </div>
  );
}
