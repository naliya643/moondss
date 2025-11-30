"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const COLORS = {
  bg: "#F4F7F2",          // latar navbar
  text: "#2F4F3A",         // teks link
  hover: "hover:text-[#1F392C]", // hover link
  shadow: "rgba(0, 0, 0, 0.12)", // bayangan bawah navbar
};

export default function Navbar() {
  const pathname = usePathname();
  const isBeranda = pathname === "/";

  return (
    <nav
      className="flex justify-between items-center px-6 py-4"
      style={{
        fontFamily: "Segoe UI, Arial, sans-serif",
        backgroundColor: COLORS.bg,
        boxShadow: `0 4px 10px -2px ${COLORS.shadow}`, // bayangan bawah lebih nyata
        position: "sticky",
        top: 0,
        zIndex: 50, // pastikan navbar di atas konten
      }}
    >
      {/* LOGO DIHILANGKAN */}
      <h1 className="text-xl font-semibold" style={{ color: COLORS.text }}></h1>

      <ul className="flex space-x-6 text-sm font-medium">
        {isBeranda ? (
          <li className="relative group">
            <Link
              href="/tentang-kami"
              className={`transition-all duration-200 ${COLORS.hover}`}
              style={{ color: COLORS.text }}
            >
              About Us
              <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-[#1F392C] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
            </Link>
          </li>
        ) : (
          <li className="relative group">
            <Link
              href="/"
              className={`transition-all duration-200 ${COLORS.hover}`}
              style={{ color: COLORS.text }}
            >
              Beranda
              <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-[#1F392C] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
