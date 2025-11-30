import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "SPK Skincare",
  description: "Sistem Pendukung Keputusan Pemilihan Kandungan Skincare",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Tambahkan link ke Font Awesome biar ikon tampil */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
        <link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap"
  rel="stylesheet"
/>
    
      </head>
      <body className="bg-white text-gray-900">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
