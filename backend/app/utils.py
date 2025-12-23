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
    return kandungan_c1 == user_c1


def is_match_c2(kandungan_c2: str, user_c2: str) -> bool:
    return kandungan_c2 == user_c2


def is_safe_severity(kandungan_c3: str, user_c3: str) -> bool:
    return severity_level(kandungan_c3) >= severity_level(user_c3)


# ===============================
# KONVERSI UNTUK TOPSIS
# ===============================
def convert_c1(value: str) -> int:
    mapping = {
        "Normal": 3,
        "Kering": 2,
        "Berminyak": 4,
        "Kombinasi": 3
    }
    return mapping.get(value, 0)


def convert_c2(value: str) -> int:
    """
    Skala diperlebar agar jenis jerawat lebih dominan di TOPSIS
    """
    mapping = {
        "Komedo": 1,
        "Papula": 3,
        "Pustula": 6,
        "Nodul": 8,
        "Kistik": 10,
        "Jerawat Jamur": 6
    }
    return mapping.get(value, 0)


def convert_c3(value: str) -> int:
    mapping = {
        "Ringan": 1,
        "Sedang": 2,
        "Berat": 3
    }
    return mapping.get(value, 0)
