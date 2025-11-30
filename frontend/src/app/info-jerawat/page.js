export default function InformasiPage() {
  const COLORS = {
    bg: "#F4F7F2",            // background lembut
    text: "#2F4F3A",          // hijau elegan
    title: "#2F4F3A",         // judul
    cardBg: "#FFFFFF",
  };

  const FONT = {
    fontFamily: "Segoe UI, Arial, sans-serif",
  };

  const dataJerawat = [
    {
      img: "/papulaacne.jpg",
      title: "Jerawat Papula",
      desc: "Papula adalah benjolan kecil berwarna merah tanpa nanah, biasanya terasa nyeri saat disentuh."
    },
    {
      img: "/jerawat_pustula.jpeg",
      title: "Jerawat Pustula",
      desc: "Pustula adalah jerawat dengan kepala putih atau kuning berisi nanah akibat peradangan."
    },
    {
      img: "/kistikacne.jpg",
      title: "Jerawat Kistik",
      desc: "Jerawat kistik berukuran besar dan berisi nanah jauh di dalam kulit. Sering meninggalkan bekas."
    },
    {
      img: "/nodulacne.jpeg",
      title: "Jerawat Nodul",
      desc: "Nodul adalah jerawat keras, besar, dan menyakitkan tanpa nanah yang terbentuk di lapisan kulit dalam."
    },
    {
      img: "/komedoacne.jpg",
      title: "Komedo",
      desc: "Komedo terjadi ketika pori tersumbat minyak dan sel kulit mati, bisa berupa hitam atau putih."
    }
  ];

  return (
    <main
      className="min-h-screen p-6"
      style={{
        backgroundColor: COLORS.bg,
        ...FONT,
      }}
    >
      <h1
        className="text-3xl font-bold text-center mb-3"
        style={{
          color: COLORS.title,
        }}
      >
        Ayo Mengenal Jenis-Jenis Jerawat
      </h1>

      <p
        className="text-center max-w-2xl mx-auto mb-10"
        style={{ color: COLORS.text }}
      >
        Pelajari berbagai jenis jerawat agar kamu bisa lebih mudah menentukan
        perawatan yang tepat sesuai kondisi kulitmu.
      </p>

      {/* Grid custom */}
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Baris 1 → 2 foto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {dataJerawat.slice(0, 2).map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl shadow-md"
              style={{ backgroundColor: COLORS.cardBg }}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
              <h2
                className="text-xl font-semibold"
                style={{ color: COLORS.title }}
              >
                {item.title}
              </h2>
              <p className="text-sm mt-1" style={{ color: COLORS.text }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Baris 2 → 2 foto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {dataJerawat.slice(2, 4).map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl shadow-md"
              style={{ backgroundColor: COLORS.cardBg }}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
              <h2
                className="text-xl font-semibold"
                style={{ color: COLORS.title }}
              >
                {item.title}
              </h2>
              <p className="text-sm mt-1" style={{ color: COLORS.text }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Baris 3 → 1 foto */}
        <div className="flex justify-center">
          <div
            className="p-4 rounded-2xl shadow-md max-w-sm"
            style={{ backgroundColor: COLORS.cardBg }}
          >
            <img
              src={dataJerawat[4].img}
              alt={dataJerawat[4].title}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
            <h2
              className="text-xl font-semibold"
              style={{ color: COLORS.title }}
            >
              {dataJerawat[4].title}
            </h2>
            <p className="text-sm mt-1" style={{ color: COLORS.text }}>
              {dataJerawat[4].desc}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
