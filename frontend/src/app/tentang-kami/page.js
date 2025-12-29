"use client";

import { useRouter } from "next/navigation";

export default function TentangKami() {
  const router = useRouter();

  const COLORS = {
    bg: "#F4F7F2",
    text: "#2F4F3A",
    cardBg: "#E6F9E6",
    title: "#397045ff",
    footerBg: "#2F4F3A",
  };

  const FONT = {
    fontFamily: "Segoe UI, Arial, sans-serif",
  };

  return (
    <section
      className="min-h-screen flex flex-col px-6 pt-16"
      style={{
        backgroundColor: COLORS.bg,
        color: COLORS.text,
        ...FONT,
      }}
    >
      {/* === TOMBOL BACK === */}
      <button
        onClick={() => router.back()}
        className="
          fixed top-65 left-6 z-50
          w-10 h-10 rounded-full
          flex items-center justify-center
          bg-white text-[#2F4F3A]
          shadow-md
          transition-all duration-200
          hover:bg-[#E6F9E6]
          hover:scale-105
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
          className="transition-transform group-hover:-translate-x-0.5"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* JUDUL */}
      <div className="text-center mb-20">
        <h1 className="text-3xl font-semibold" style={{ color: COLORS.title }}>
          Sistem Pendukung Keputusan Pemilihan Kandungan Skincare Yang Tepat
          Untuk Kulit Berjerawat Menggunakan Metode{" "}
          <span className="font-bold">TOPSIS</span>.
        </h1>
      </div>

      {/* TIM */}
      <div className="max-w-4xl mx-auto mt-1 mb-12">
        <h2 className="text-2xl font-bold mb-3 text-center" style={{ color: COLORS.title }}>
          Pengembang Aplikasi
        </h2>

        <div
          className="p-6 rounded-2xl shadow-md flex items-start gap-6"
          style={{ backgroundColor: COLORS.cardBg }}
        >
          <img
            src="/lala.png"
            alt="Foto Pengembang"
            className="w-35 h-35 rounded-full object-cover border-2 shadow-sm"
            style={{ borderColor: COLORS.title }}
          />

          <div>
            <p className="text-lg font-semibold mb-2" style={{ color: COLORS.title }}>
              Hilaliya
            </p>

            <p className="leading-relaxed">
              Hai!
            </p>

            <p className="leading-relaxed">
              Aku persembahkan Sistem Pendukung Keputusan ini untuk teman-teman
              sesama Acne Fighter. Semoga sistem ini dapat dikembangkan menjadi
              sistem yang dapat menghasilkan hasil analisis yang akurat dan
              valid, sehingga dapat bermanfaat bagi kita semua!
            </p>
          </div>
        </div>
      </div>

      {/* VISI & MISI */}
      <h2 className="text-2xl font-bold mb-1 text-center" style={{ color: COLORS.title }}>
        Visi & Misi
      </h2>

      <div
        className="max-w-4xl mx-auto p-8 rounded-2xl shadow-md mt-1"
        style={{ backgroundColor: COLORS.cardBg }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.title }}>
          Visi
        </h2>

        <p className="mb-8 leading-relaxed">
          Menjadi platform yang membantu dalam pemilihan kandungan skincare
          dengan tepat, mudah digunakan, dan memberikan edukasi tentang
          kandungan skincare secara informatif.
        </p>

        <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.title }}>
          Misi
        </h2>

        <ul className="list-disc ml-6 space-y-2 leading-relaxed">
          <li>Membantu pengguna memahami fungsi dan manfaat setiap kandungan skincare.</li>
          <li>Menyediakan pengalaman aplikasi yang sederhana dan informatif.</li>
          <li>Mendukung edukasi skincare berbasis data dan analisis ilmiah.</li>
        </ul>
      </div>

      {/* CONTACT */}
      <div className="text-center mt-16 mb-15" id="contact">
        <h2 className="text-3xl font-bold mb-6" style={{ color: COLORS.title }}>
          Connect With Me
        </h2>

        <div className="flex justify-center space-x-8">
          <a
            href="https://wa.me/6285717556342"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl transition"
          >
            <i className="fa-brands fa-whatsapp"></i>
          </a>

          <a
            href="https://instagram.com/hilaliya.abdullah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl transition"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>

          <a
            href="mailto:hilaliyah643@gmail.com"
            className="text-3xl transition"
          >
            <i className="fa-solid fa-envelope"></i>
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <footer
          className="w-full text-white text-center py-6 rounded-t-2xl"
          style={{ backgroundColor: COLORS.footerBg }}
        >
          <p className="text-sm">
            © 2025 <span className="font-semibold">SPK Skincare</span> | Hilaliya&apos;s Project
          </p>

          <div className="mt-3">
            <a
              href="#contact"
              className="text-white text-2xl hover:opacity-80 transition-opacity"
            >
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}