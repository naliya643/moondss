"use client"; // PENTING: Untuk menggunakan usePathname

import { usePathname } from 'next/navigation';
import "./globals.css";
import Navbar from "@/components/Navbar"; 
// export const metadata DIHAPUS DARI SINI!

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Cek apakah user sedang berada di halaman admin
  const isAdminPage = pathname && pathname.startsWith('/admin');

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
        {/* Tambahkan tag <title> secara manual karena metadata dihapus */}
        <title>SPK Skincare</title> 
      </head>
      <body className="bg-white text-gray-900">
        
        {/* Kondisional: Navbar hanya tampil jika BUKAN halaman admin */}
        {!isAdminPage && <Navbar />} 
        
        <main>{children}</main>
      </body>
    </html>
  );
}