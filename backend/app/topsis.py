"""
TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
Versi user-centric (jarak ke preferensi user)
"""

import math
from typing import List, Dict, Any
from .database import get_db
from .utils import convert_c1, convert_c2, convert_c3


def hitung_topsis(c1_user: str, c2_user: str, c3_user: str) -> List[Dict[str, Any]]:
    """
    Hitung rekomendasi kandungan skincare menggunakan TOPSIS.
    Preferensi user dijadikan titik referensi.
    """

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        # 1️⃣ Ambil data kandungan
        cursor.execute("""
            SELECT id, nama_kandungan, deskripsi, c1, c2, c3, c4
            FROM kandungan
        """)
        kandungan_list = cursor.fetchall()
        if not kandungan_list:
            return []

        # 2️⃣ Ambil data kriteria & bobot
        cursor.execute("""
            SELECT kode, bobot, tipe
            FROM kriteria
            ORDER BY kode
        """)
        kriteria_list = cursor.fetchall()

        bobot = [float(k["bobot"]) for k in kriteria_list]

        # 3️⃣ Konversi input user → numerik
        user_vector = [
            float(convert_c1(c1_user)),
            float(convert_c2(c2_user)),
            float(convert_c3(c3_user)),
            5.0  # c4 dianggap ideal (efektivitas maksimal)
        ]

        # 4️⃣ Matriks keputusan (alternatif kandungan)
        decision_matrix = []
        for k in kandungan_list:
            decision_matrix.append([
                float(convert_c1(k["c1"])),
                float(convert_c2(k["c2"])),
                float(convert_c3(k["c3"])),
                float(k["c4"]) if k["c4"] is not None else 0.0
            ])

        # 5️⃣ Normalisasi matriks
        normalized_matrix = normalize_matrix(decision_matrix)

        # 6️⃣ Normalisasi preferensi user (pakai skala data)
        normalized_user = normalize_user(user_vector, decision_matrix)

        # 7️⃣ Pembobotan
        weighted_matrix = [
            [
                normalized_matrix[i][j] * bobot[j]
                for j in range(len(bobot))
            ]
            for i in range(len(normalized_matrix))
        ]

        weighted_user = [
            normalized_user[j] * bobot[j]
            for j in range(len(bobot))
        ]

        # 8️⃣ Hitung jarak alternatif ke user
        results = []
        for i, k in enumerate(kandungan_list):
            distance = math.sqrt(sum(
                (weighted_matrix[i][j] - weighted_user[j]) ** 2
                for j in range(len(bobot))
            ))

            skor = 1 / (1 + distance)

            results.append({
                "id": k["id"],
                "nama": k["nama_kandungan"],
                "deskripsi": k["deskripsi"],
                "c1": k["c1"],
                "c2": k["c2"],
                "c3": k["c3"],
                "c4": k["c4"],
                "skor": round(skor, 4)
            })

        # 9️⃣ Sorting & ranking
        results.sort(key=lambda x: x["skor"], reverse=True)
        for i, r in enumerate(results, start=1):
            r["rank"] = i

        return results

    except Exception as e:
        print("TOPSIS ERROR:", e)
        raise e

    finally:
        cursor.close()
        db.close()


def normalize_matrix(matrix: List[List[float]]) -> List[List[float]]:
    """Normalisasi vektor matriks keputusan"""
    transposed = list(zip(*matrix))
    norm_factors = [
        math.sqrt(sum(x ** 2 for x in col))
        for col in transposed
    ]

    normalized = []
    for row in matrix:
        normalized.append([
            row[i] / norm_factors[i] if norm_factors[i] != 0 else 0
            for i in range(len(row))
        ])
    return normalized


def normalize_user(user: List[float], matrix: List[List[float]]) -> List[float]:
    """Normalisasi input user mengikuti skala data alternatif"""
    transposed = list(zip(*matrix))
    norm_factors = [
        math.sqrt(sum(x ** 2 for x in col))
        for col in transposed
    ]

    return [
        user[i] / norm_factors[i] if norm_factors[i] != 0 else 0
        for i in range(len(user))
    ]
