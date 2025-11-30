export default function TentangKami() {
  const COLORS = {
    bg: "#F4F7F2",
    text: "#2F4F3A",
    cardBg: "#E6F9E6",
    title: "#2F4F3A",
    footerBg: "#2F4F3A",
  };

  const FONT = {
    fontFamily: "Segoe UI, Arial, sans-serif",
  };

  return (
    <section
      className="min-h-screen py-16 px-6"
      style={{
        backgroundColor: COLORS.bg,
        color: COLORS.text,
        ...FONT,
      }}
    >
      {/* JUDUL */}
      <div className="text-center mb-14">
        <h1
          className="text-4xl font-extrabold"
          style={{ color: COLORS.title }}
        >
          About Us
        </h1>
        <p
          className="mt-3 text-lg max-w-3xl mx-auto leading-relaxed"
          style={{ color: COLORS.text }}
        >
          Sistem Pendukung Keputusan Pemilihan Kandungan Skincare yang
          membantu pengguna memilih bahan skincare terbaik sesuai kondisi
          kulit menggunakan metode <span className="font-semibold">TOPSIS</span>.
        </p>
      </div>

      {/* VISI & MISI */}
      <div
        className="max-w-4xl mx-auto p-8 rounded-2xl shadow-md"
        style={{ backgroundColor: COLORS.cardBg }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: COLORS.title }}
        >
          Visi
        </h2>

        <p className="mb-8 leading-relaxed" style={{ color: COLORS.text }}>
          Menjadi platform rekomendasi skincare yang akurat, mudah digunakan,
          dan memberikan edukasi tentang kandungan skincare secara informatif.
        </p>

        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: COLORS.title }}
        >
          Misi
        </h2>

        <ul className="list-disc ml-6 space-y-2 leading-relaxed" style={{ color: COLORS.text }}>
          <li>Membantu pengguna memahami fungsi dan manfaat setiap kandungan skincare.</li>
          <li>Menyediakan sistem perhitungan objektif menggunakan metode TOPSIS.</li>
          <li>Menyediakan pengalaman aplikasi yang sederhana dan informatif.</li>
          <li>Mendukung edukasi skincare berbasis data dan analisis ilmiah.</li>
        </ul>
      </div>

      {/* TIM */}
      <div className="max-w-4xl mx-auto mt-16 p-8 rounded-2xl">
        <h2
          className="text-2xl font-bold mb-4 text-center"
          style={{ color: COLORS.title }}
        >
          Pengembang Aplikasi
        </h2>

        <p
          className="text-center max-w-2xl mx-auto leading-relaxed"
          style={{ color: COLORS.text }}
        >
          Aplikasi ini dikembangkan sebagai studi kasus Sistem Pendukung
          Keputusan untuk membantu pengguna memilih kandungan skincare
          berdasarkan kebutuhan kulit mereka.
        </p>
      </div>

      {/* CONTACT */}
      <div className="text-center mt-16" id="contact">
        <h2
          className="text-3xl font-bold mb-6"
          style={{ color: COLORS.title }}
        >
          Connect With Me
        </h2>

        <div className="flex justify-center space-x-8">
          <a
            href="https://wa.me/6285717556342"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl transition"
            style={{ color: COLORS.text }}
          >
            <i className="fa-brands fa-whatsapp"></i>
          </a>

          <a
            href="https://instagram.com/hilaliya.abdullah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl transition"
            style={{ color: COLORS.text }}
          >
            <i className="fa-brands fa-instagram"></i>
          </a>

          <a
            href="mailto:hilaliyah643@gmail.com"
            className="text-3xl transition"
            style={{ color: COLORS.text }}
          >
            <i className="fa-solid fa-envelope"></i>
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        className="text-white text-center py-6 mt-20 rounded-t-2xl"
        style={{ backgroundColor: COLORS.footerBg }}
      >
        <p className="text-sm">
          © 2025 <span className="font-semibold">SPK Skincare</span>. All Rights Reserved.
        </p>

        <div className="mt-3">
          <a
            href="#contact"
            className="text-white text-2xl hover:opacity-80 transition-opacity"
          >
            <i className="fa-solid fa-arrow-up"></i>
          </a>
        </div>
      </footer>
    </section>
  );
}
