import Link from "next/link";
import Image from "next/image";

const COLORS = {
  bgMain: "bg-[#F4F7F2]",
  arcColor: "bg-white",
  greenText: "#2F4F3A",
  buttonBg: "bg-[#DDE6D5]",
  buttonHover: "hover:bg-[#C8D3BE]",
  text: "#2F4F3A",
  title: "#2F4F3A",
  footerBg: "#2F4F3A",
};

export default function Home() {
  return (
    <section className={`min-h-screen ${COLORS.bgMain} relative overflow-hidden`}>

      {/* Lengkungan putih */}
      <div
        className={`${COLORS.arcColor} w-full`}
        style={{
          height: "100vh",
          borderBottomLeftRadius: "50%",
          borderBottomRightRadius: "50%",
          transform: "scaleX(1.7)",
          position: "absolute",
          top: "-15vh",
          zIndex: 0,
        }}
      />

      {/* KONTEN ATAS */}
      <main
        className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center p-6"
        style={{ marginTop: "-60px" }}
      >
        {/* LOGO */}
        <Image
          src="/logobaru.png"
          alt="Logo SPK Skincare"
          width={250}
          height={250}
          className="object-contain mb-1"
          priority
        />

        {/* Tagline */}
            <h3
       className="text-lg max-w-xl leading-relaxed mb-15 -mt-17"

        style={{
          fontFamily: "Segoe UI, Arial, sans-serif",
          color: COLORS.greenText,
        }}
      >
        Temukan Kandungan Skincare Paling Tepat Untuk Kulitmu Dan Dapatkan
        Kulit Sehat Impianmu!
      </h3> 

        {/* Tombol */}
        <div className="flex flex-col md:flex-row gap-6 mt-2">
          <Link
            href="/analisis"
            className={`px-10 py-3 rounded-full text-base shadow-md transition ${COLORS.buttonBg} ${COLORS.buttonHover}`}
            style={{
              fontFamily: "Segoe UI, Arial, sans-serif",
              fontWeight: 600,
              color: COLORS.greenText,
            }}
          >
            Mulai Analisis
          </Link>

          <Link
            href="/info-jerawat"
            className={`px-10 py-3 rounded-full text-base shadow-md transition ${COLORS.buttonBg} ${COLORS.buttonHover}`}
            style={{
              fontFamily: "Segoe UI, Arial, sans-serif",
              fontWeight: 600,
              color: COLORS.greenText,
            }}
          >
            Informasi Jerawat
          </Link>
        </div>
      </main>

      {/* CONTACT SECTION */}
      <div className="text-center mt-16 px-6" id="contact">
        <h2
          className="text-3xl font-bold mb-6"
          style={{ color: COLORS.title }}
        >
          Connect With Me
        </h2>

        <div className="flex justify-center space-x-8 text-3xl">
          <a
            href="https://wa.me/6285717556342"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:opacity-80"
            style={{ color: COLORS.text }}
          >
            <i className="fa-brands fa-whatsapp"></i>
          </a>

          <a
            href="https://instagram.com/hilaliya.abdullah"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:opacity-80"
            style={{ color: COLORS.text }}
          >
            <i className="fa-brands fa-instagram"></i>
          </a>

          <a
            href="mailto:hilaliyah643@gmail.com"
            className="transition hover:opacity-80"
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
