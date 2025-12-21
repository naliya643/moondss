"""
Utility functions untuk preprocessing data sebelum TOPSIS.

Catatan desain:
- C1 & C2 bersifat kategorikal → dikonversi ke angka HANYA untuk TOPSIS
- C3 (keparahan) → dipakai untuk filter & juga dikonversi untuk TOPSIS
- File ini TIDAK BOLEH import topsis / api (helper murni)
"""

# ===============================
# KEPAHRAHAN (FILTER & KONVERSI)
# ===============================
def severity_level(value: str) -> int:
    """
    Konversi tingkat keparahan jerawat ke level numerik.
    DIGUNAKAN untuk FILTER keamanan skincare.

    Ringan = 1
    Sedang = 2
    Berat  = 3
    """
    mapping = {
        "Ringan": 1,
        "Sedang": 2,
        "Berat": 3
    }
    return mapping.get(value, 0)


# ===============================
# MATCHING (LOGIC FILTER)
# ===============================
def is_match_c1(kandungan_c1: str, user_c1: str) -> bool:
    """
    Cek kecocokan jenis kulit.
    Saat ini HARUS sama persis.
    """
    return kandungan_c1 == user_c1


def is_match_c2(kandungan_c2: str, user_c2: str) -> bool:
    """
    Cek kecocokan jenis jerawat.
    HARUS sama persis.
    """
    return kandungan_c2 == user_c2


def is_safe_severity(kandungan_c3: str, user_c3: str) -> bool:
    """
    Kandungan harus punya level keparahan
    >= kondisi user (aturan aman skincare).
    """
    return severity_level(kandungan_c3) >= severity_level(user_c3)


# ===============================
# KONVERSI UNTUK TOPSIS
# ===============================
def convert_c1(value: str) -> int:
    """
    Konversi jenis kulit ke skala numerik
    (khusus untuk perhitungan TOPSIS).
    """
    mapping = {
        "Normal": 3,
        "Kering": 2,
        "Berminyak": 4,
        "Kombinasi": 3
    }
    return mapping.get(value, 0)


def convert_c2(value: str) -> int:
    """
    Konversi jenis jerawat ke skala numerik
    (untuk TOPSIS).
    """
    mapping = {
        "Komedo": 1,
        "Papula": 2,
        "Pustula": 3,
        "Nodul": 4,
        "Kistik": 5,
        "Jerawat Jamur": 3
    }
    return mapping.get(value, 0)


def convert_c3(value: str) -> int:
    """
    Konversi tingkat keparahan ke angka
    (untuk TOPSIS).
    """
    mapping = {
        "Ringan": 1,
        "Sedang": 2,
        "Berat": 3
    }
    return mapping.get(value, 0)
