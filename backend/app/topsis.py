def hitung_topsis(data):
    """
    Dummy function sementara untuk simulasi hasil rekomendasi.
    Nanti kamu bisa ganti logika ini dengan perhitungan TOPSIS sesungguhnya.
    """
    print("Input dari user:", data)

    # contoh hasil dummy berdasarkan jenis kulit
    if data.jenisKulit.lower() == "berminyak":
        rekomendasi = [
            {"kandungan": "Niacinamide", "produk": "Somethinc Niacinamide 10%", "harga": "Rp90.000", "skor": 0.88},
            {"kandungan": "Panthenol", "produk": "Skintific Panthenol Moisturizer", "harga": "Rp110.000", "skor": 0.79},
        ]
    elif data.jenisKulit.lower() == "kering":
        rekomendasi = [
            {"kandungan": "Hyaluronic Acid", "produk": "Wardah Hydrating Serum", "harga": "Rp85.000", "skor": 0.82},
        ]
    else:
        rekomendasi = [
            {"kandungan": "Centella Asiatica", "produk": "Skintific Cica Cream", "harga": "Rp120.000", "skor": 0.76},
        ]

    return rekomendasi
