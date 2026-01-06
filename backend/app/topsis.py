import math
from typing import List, Dict, Any
from .database import get_db
from .utils import convert_c1, convert_c2, convert_c3, is_match_c1, is_match_c2, is_safe_severity


def hitung_topsis(c1_user: str, c2_user: str, c3_user: str) -> List[Dict[str, Any]]:
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        # 1️⃣ Ambil data kandungan dan filter berdasarkan input user
        cursor.execute("""
            SELECT id, nama_kandungan, deskripsi, c1, c2, c3, c4
            FROM kandungan
        """)
        all_kandungan = cursor.fetchall()
        if not all_kandungan:
            return []

        # Filter kandungan yang cocok dengan kondisi user
        from .utils import is_match_c1, is_match_c2, is_safe_severity
        kandungan_list = [
            k for k in all_kandungan
            if is_match_c1(k["c1"], c1_user) and
               is_match_c2(k["c2"], c2_user) and
               is_safe_severity(k["c3"], c3_user)
        ]

        if not kandungan_list:
            return []

        # 2️⃣ Ambil bobot kriteria (urutan HARUS konsisten)
        cursor.execute("""
            SELECT kode, bobot
            FROM kriteria
            ORDER BY kode
        """)
        kriteria_list = cursor.fetchall()
        bobot = [float(k["bobot"]) for k in kriteria_list]

        # 3️⃣ Matriks keputusan (numeric)
        decision_matrix = []
        for k in kandungan_list:
            decision_matrix.append([
                float(convert_c1(k["c1"])),
                float(convert_c2(k["c2"])),
                float(convert_c3(k["c3"])),
                float(k["c4"]) if k["c4"] is not None else 0.0
            ])

        # 4️⃣ Normalisasi matriks
        normalized_matrix = normalize_matrix(decision_matrix)

        # 5️⃣ Matriks berbobot
        weighted_matrix = [
            [normalized_matrix[i][j] * bobot[j] for j in range(len(bobot))]
            for i in range(len(normalized_matrix))
        ]

        # 6️⃣ Tentukan ideal positif (+) dan negatif (-)
        ideal_positive = [max(col) for col in zip(*weighted_matrix)]
        ideal_negative = [min(col) for col in zip(*weighted_matrix)]

        # 7️⃣ Hitung jarak ke A⁺ dan A⁻
        results = []
        for i, k in enumerate(kandungan_list):
            d_pos = math.sqrt(sum((weighted_matrix[i][j] - ideal_positive[j]) ** 2 for j in range(len(bobot))))
            d_neg = math.sqrt(sum((weighted_matrix[i][j] - ideal_negative[j]) ** 2 for j in range(len(bobot))))
            ci = d_neg / (d_pos + d_neg)  # skor TOPSIS 0-1

            results.append({
                "id": k["id"],
                "nama": k["nama_kandungan"],
                "deskripsi": k["deskripsi"],
                "c1": k["c1"],
                "c2": k["c2"],
                "c3": k["c3"],
                "c4": k["c4"],
                "a_plus": [round(val,4) for val in ideal_positive],
                "a_minus": [round(val,4) for val in ideal_negative],
                "d_pos": round(d_pos, 4),
                "d_neg": round(d_neg, 4),
                "skor": round(ci, 4)
            })

        # 8️⃣ Ranking
        return results

    finally:
        cursor.close()
        db.close()


def hitung_topsis_detailed(c1_user: str, c2_user: str, c3_user: str) -> Dict[str, Any]:
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
            return {}

        # 2️⃣ Ambil bobot kriteria (urutan HARUS konsisten)
        cursor.execute("""
            SELECT kode, bobot
            FROM kriteria
            ORDER BY kode
        """)
        kriteria_list = cursor.fetchall()
        bobot = [float(k["bobot"]) for k in kriteria_list]

        # Data Awal
        dataAwal = [
            {
                "nama_kandungan": k["nama_kandungan"],
                "c1": k["c1"],
                "c2": k["c2"],
                "c3": k["c3"],
                "c4": k["c4"]
            }
            for k in kandungan_list
        ]

        # 3️⃣ Matriks keputusan (numeric)
        decision_matrix = []
        for k in kandungan_list:
            decision_matrix.append([
                float(convert_c1(k["c1"])),
                float(convert_c2(k["c2"])),
                float(convert_c3(k["c3"])),
                float(k["c4"]) if k["c4"] is not None else 0.0
            ])

        matriksKeputusan = [
            {
                "nama_kandungan": k["nama_kandungan"],
                "c1": round(decision_matrix[i][0], 4),
                "c2": round(decision_matrix[i][1], 4),
                "c3": round(decision_matrix[i][2], 4),
                "c4": round(decision_matrix[i][3], 4)
            }
            for i, k in enumerate(kandungan_list)
        ]

        # 4️⃣ Normalisasi matriks
        normalized_matrix = normalize_matrix(decision_matrix)

        matriksNormalisasi = [
            {
                "nama_kandungan": k["nama_kandungan"],
                "c1": round(normalized_matrix[i][0], 4),
                "c2": round(normalized_matrix[i][1], 4),
                "c3": round(normalized_matrix[i][2], 4),
                "c4": round(normalized_matrix[i][3], 4)
            }
            for i, k in enumerate(kandungan_list)
        ]

        # 5️⃣ Matriks berbobot
        weighted_matrix = [
            [normalized_matrix[i][j] * bobot[j] for j in range(len(bobot))]
            for i in range(len(normalized_matrix))
        ]

        matriksBerbobot = [
            {
                "nama_kandungan": k["nama_kandungan"],
                "v1": round(weighted_matrix[i][0], 4),
                "v2": round(weighted_matrix[i][1], 4),
                "v3": round(weighted_matrix[i][2], 4),
                "v4": round(weighted_matrix[i][3], 4)
            }
            for i, k in enumerate(kandungan_list)
        ]

        # 6️⃣ Tentukan ideal positif (+) dan negatif (-)
        ideal_positive = [max(col) for col in zip(*weighted_matrix)]
        ideal_negative = [min(col) for col in zip(*weighted_matrix)]

        solusiIdeal = {
            "aPlus": [round(val, 4) for val in ideal_positive],
            "aMinus": [round(val, 4) for val in ideal_negative]
        }

        # 7️⃣ Hitung jarak ke A⁺ dan A⁻
        jarak = []
        preferensi = []
        for i, k in enumerate(kandungan_list):
            d_pos = math.sqrt(sum((weighted_matrix[i][j] - ideal_positive[j]) ** 2 for j in range(len(bobot))))
            d_neg = math.sqrt(sum((weighted_matrix[i][j] - ideal_negative[j]) ** 2 for j in range(len(bobot))))
            ci = d_neg / (d_pos + d_neg)  # skor TOPSIS 0-1

            # soft penalty (optional, realistis)
            if k["c2"] != c2_user:
                ci *= 0.8

            jarak.append({
                "nama_kandungan": k["nama_kandungan"],
                "d_plus": round(d_pos, 4),
                "d_minus": round(d_neg, 4)
            })

            preferensi.append({
                "nama_kandungan": k["nama_kandungan"],
                "ci": round(ci, 4),
                "ranking": 0  # akan diisi setelah sorting
            })

        # 8️⃣ Ranking
        preferensi.sort(key=lambda x: x["ci"], reverse=True)
        for i, p in enumerate(preferensi, start=1):
            p["ranking"] = i

        return {
            "dataAwal": dataAwal,
            "matriksKeputusan": matriksKeputusan,
            "matriksNormalisasi": matriksNormalisasi,
            "matriksBerbobot": matriksBerbobot,
            "solusiIdeal": solusiIdeal,
            "jarak": jarak,
            "preferensi": preferensi
        }

    finally:
        cursor.close()
        db.close()


def normalize_matrix(matrix: List[List[float]]) -> List[List[float]]:
    if not matrix or not matrix[0]:
        return []

    num_rows = len(matrix)
    num_cols = len(matrix[0])

    # Hitung akar kuadrat dari jumlah kuadrat setiap kolom
    denominators = []
    for j in range(num_cols):
        sum_squares = sum(matrix[i][j] ** 2 for i in range(num_rows))
        denominators.append(math.sqrt(sum_squares))

    # Normalisasi
    normalized = []
    for i in range(num_rows):
        row = []
        for j in range(num_cols):
            if denominators[j] != 0:
                row.append(matrix[i][j] / denominators[j])
            else:
                row.append(0.0)
        normalized.append(row)

    return normalized


def hitung_topsis_detailed(c1_user: str, c2_user: str, c3_user: str) -> Dict[str, Any]:
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        # 1️⃣ Ambil data kandungan dan filter berdasarkan input user
        cursor.execute("""
            SELECT id, nama_kandungan, deskripsi, c1, c2, c3, c4
            FROM kandungan
        """)
        all_kandungan = cursor.fetchall()
        if not all_kandungan:
            return {}

        # Filter kandungan yang cocok dengan kondisi user
        from .utils import is_match_c1, is_match_c2, is_safe_severity
        kandungan_list = [
            k for k in all_kandungan
            if is_match_c1(k["c1"], c1_user) and
               is_match_c2(k["c2"], c2_user) and
               is_safe_severity(k["c3"], c3_user)
        ]

        if not kandungan_list:
            return {}

        # 2️⃣ Ambil bobot kriteria (urutan HARUS konsisten)
        cursor.execute("""
            SELECT kode, bobot
            FROM kriteria
            ORDER BY kode
        """)
        kriteria_list = cursor.fetchall()
        bobot = [float(k["bobot"]) for k in kriteria_list]

        # Data Awal
        dataAwal = [
            {
                "nama_kandungan": k["nama_kandungan"],
                "c1": k["c1"],
                "c2": k["c2"],
                "c3": k["c3"],
                "c4": k["c4"]
            }
            for k in kandungan_list
        ]
        decision_matrix = []
        for k in kandungan_list:
            decision_matrix.append([
                float(convert_c1(k["c1"])),
                float(convert_c2(k["c2"])),
                float(convert_c3(k["c3"])),
                float(k["c4"]) if k["c4"] is not None else 0.0
            ])

        matriksKeputusan = [
            {
                "nama_kandungan": k["nama_kandungan"],
                "c1": round(decision_matrix[i][0], 4),
                "c2": round(decision_matrix[i][1], 4),
                "c3": round(decision_matrix[i][2], 4),
                "c4": round(decision_matrix[i][3], 4)
            }
            for i, k in enumerate(kandungan_list)
        ]

        # 4️⃣ Normalisasi matriks
        normalized_matrix = normalize_matrix(decision_matrix)

        matriksNormalisasi = [
            {
                "nama_kandungan": k["nama_kandungan"],
                "c1": round(normalized_matrix[i][0], 4),
                "c2": round(normalized_matrix[i][1], 4),
                "c3": round(normalized_matrix[i][2], 4),
                "c4": round(normalized_matrix[i][3], 4)
            }
            for i, k in enumerate(kandungan_list)
        ]

        # 5️⃣ Matriks berbobot
        weighted_matrix = [
            [normalized_matrix[i][j] * bobot[j] for j in range(len(bobot))]
            for i in range(len(normalized_matrix))
        ]

        matriksBerbobot = [
            {
                "nama_kandungan": k["nama_kandungan"],
                "v1": round(weighted_matrix[i][0], 4),
                "v2": round(weighted_matrix[i][1], 4),
                "v3": round(weighted_matrix[i][2], 4),
                "v4": round(weighted_matrix[i][3], 4)
            }
            for i, k in enumerate(kandungan_list)
        ]

        # 6️⃣ Tentukan ideal positif (+) dan negatif (-)
        ideal_positive = [max(col) for col in zip(*weighted_matrix)]
        ideal_negative = [min(col) for col in zip(*weighted_matrix)]

        solusiIdeal = {
            "aPlus": [round(val, 4) for val in ideal_positive],
            "aMinus": [round(val, 4) for val in ideal_negative]
        }

        # 7️⃣ Hitung jarak ke A⁺ dan A⁻
        jarak = []
        preferensi = []
        for i, k in enumerate(kandungan_list):
            d_pos = math.sqrt(sum((weighted_matrix[i][j] - ideal_positive[j]) ** 2 for j in range(len(bobot))))
            d_neg = math.sqrt(sum((weighted_matrix[i][j] - ideal_negative[j]) ** 2 for j in range(len(bobot))))
            ci = d_neg / (d_pos + d_neg)  # skor TOPSIS 0-1

            # soft penalty (optional, realistis)
            if k["c2"] != c2_user:
                ci *= 0.8

            jarak.append({
                "nama_kandungan": k["nama_kandungan"],
                "d_plus": round(d_pos, 4),
                "d_minus": round(d_neg, 4)
            })

            preferensi.append({
                "nama_kandungan": k["nama_kandungan"],
                "ci": round(ci, 4),
                "ranking": 0  # akan diisi setelah sorting
            })

        # 8️⃣ Ranking
        preferensi.sort(key=lambda x: x["ci"], reverse=True)
        for i, p in enumerate(preferensi, start=1):
            p["ranking"] = i

        return {
            "dataAwal": dataAwal,
            "matriksKeputusan": matriksKeputusan,
            "matriksNormalisasi": matriksNormalisasi,
            "matriksBerbobot": matriksBerbobot,
            "solusiIdeal": solusiIdeal,
            "jarak": jarak,
            "preferensi": preferensi
        }

    finally:
        cursor.close()
        db.close()
