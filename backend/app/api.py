from fastapi import FastAPI, HTTPException, Depends, Header, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Union, Optional
from decimal import Decimal
import shutil
import time
import os

from app.topsis import hitung_topsis
from app.database import get_db

# ================== APP INIT ==================
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================== AUTH ==================
class AdminLogin(BaseModel):
    username: str
    password: str


def verify_admin_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or token != "admin-token":
        raise HTTPException(status_code=401, detail="Unauthorized")


# ================== LOGIN PLAIN ==================
@app.post("/admin/login")
def admin_login(data: AdminLogin):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM admin WHERE username=%s AND password=%s",
            (data.username, data.password)
        )
        admin = cursor.fetchone()

        if not admin:
            raise HTTPException(status_code=401, detail="Username atau password salah")

        return {
            "message": "Login berhasil",
            "token": "admin-token"
        }

    finally:
        cursor.close()
        db.close()


# ================== TOPSIS ==================
class InputData(BaseModel):
    c1: str
    c2: str
    c3: str


@app.post("/analyze")
def analyze(data: InputData):
    hasil = hitung_topsis(data.c1, data.c2, data.c3)
    if not hasil:
        raise HTTPException(status_code=400, detail="Tidak ada hasil analisis")
    return hasil[0]


# ================== PRODUK PUBLIC ==================
@app.get("/produk")
def get_produk(kandungan: Optional[str] = None):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        if kandungan:
            cursor.execute(
                "SELECT * FROM produk WHERE LOWER(kandungan) LIKE %s",
                (f"%{kandungan.lower()}%",)
            )
        else:
            cursor.execute("SELECT * FROM produk")

        rows = cursor.fetchall() or []
        for r in rows:
            for k, v in r.items():
                if isinstance(v, Decimal):
                    r[k] = float(v)
        return rows

    finally:
        cursor.close()
        db.close()


# ================== ADMIN PRODUK ==================
@app.get("/admin/produk", dependencies=[Depends(verify_admin_token)])
def get_admin_produk():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM produk")
        rows = cursor.fetchall() or []
        for r in rows:
            for k, v in r.items():
                if isinstance(v, Decimal):
                    r[k] = float(v)
        return {"data": rows}

    finally:
        cursor.close()
        db.close()


@app.post("/admin/produk", dependencies=[Depends(verify_admin_token)])
async def add_produk(
    nama: str = Form(...),
    kandungan: str = Form(...),
    harga: int = Form(...),
    deskripsi: str = Form(...),
    foto: UploadFile = File(None)
):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        foto_path = None
        if foto:
            os.makedirs("static/photos", exist_ok=True)
            filename = f"{int(time.time())}_{foto.filename}"
            path = f"static/photos/{filename}"
            with open(path, "wb") as f:
                shutil.copyfileobj(foto.file, f)
            foto_path = f"/{path}"

        cursor.execute(
            "INSERT INTO produk (nama, kandungan, harga, foto, deskripsi) VALUES (%s,%s,%s,%s,%s)",
            (nama, kandungan, harga, foto_path, deskripsi)
        )
        db.commit()
        return {"detail": "Produk ditambahkan"}

    finally:
        cursor.close()
        db.close()


@app.delete("/admin/produk/{produk_id}", dependencies=[Depends(verify_admin_token)])
def delete_produk(produk_id: int):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("DELETE FROM produk WHERE id=%s", (produk_id,))
        db.commit()
        return {"detail": "Produk dihapus"}

    finally:
        cursor.close()
        db.close()


@app.put("/admin/produk/{produk_id}", dependencies=[Depends(verify_admin_token)])
async def update_produk(
    produk_id: int,
    nama: str = Form(...),
    kandungan: str = Form(...),
    harga: int = Form(...),
    deskripsi: str = Form(...),
    foto: UploadFile = File(None)
):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        foto_path = None
        if foto:
            os.makedirs("static/photos", exist_ok=True)
            filename = f"{int(time.time())}_{foto.filename}"
            path = f"static/photos/{filename}"
            with open(path, "wb") as f:
                shutil.copyfileobj(foto.file, f)
            foto_path = f"/{path}"

        if foto_path:
            cursor.execute("""
                UPDATE produk
                SET nama=%s, kandungan=%s, harga=%s, deskripsi=%s, foto=%s
                WHERE id=%s
            """, (nama, kandungan, harga, deskripsi, foto_path, produk_id))
        else:
            cursor.execute("""
                UPDATE produk
                SET nama=%s, kandungan=%s, harga=%s, deskripsi=%s
                WHERE id=%s
            """, (nama, kandungan, harga, deskripsi, produk_id))

        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan")

        return {"detail": "Produk berhasil diupdate"}

    finally:
        cursor.close()
        db.close()


# ================== ADMIN KANDUNGAN ==================
class KandunganInput(BaseModel):
    nama_kandungan: str
    deskripsi: str
    c1: Union[str, float]
    c2: Union[str, float]
    c3: Union[str, float]
    c4: Union[str, int, float]


@app.get("/admin/kandungan", dependencies=[Depends(verify_admin_token)])
def get_kandungan():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM kandungan")
        return {"data": cursor.fetchall()}

    finally:
        cursor.close()
        db.close()


@app.post("/admin/kandungan", dependencies=[Depends(verify_admin_token)])
def add_kandungan(data: KandunganInput):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            "INSERT INTO kandungan (nama_kandungan, deskripsi, c1, c2, c3, c4) VALUES (%s,%s,%s,%s,%s,%s)",
            (data.nama_kandungan, data.deskripsi, data.c1, data.c2, data.c3, data.c4)
        )
        db.commit()
        return {"detail": "Kandungan ditambahkan"}

    finally:
        cursor.close()
        db.close()


@app.delete("/admin/kandungan/{kandungan_id}", dependencies=[Depends(verify_admin_token)])
def delete_kandungan(kandungan_id: int):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("DELETE FROM kandungan WHERE id=%s", (kandungan_id,))
        db.commit()
        return {"detail": "Kandungan dihapus"}
    finally:
        cursor.close()
        db.close()


@app.put("/admin/kandungan/{kandungan_id}", dependencies=[Depends(verify_admin_token)])
def update_kandungan(kandungan_id: int, data: KandunganInput):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            UPDATE kandungan
            SET nama_kandungan=%s, deskripsi=%s, c1=%s, c2=%s, c3=%s, c4=%s
            WHERE id=%s
        """, (
            data.nama_kandungan,
            data.deskripsi,
            data.c1,
            data.c2,
            data.c3,
            data.c4,
            kandungan_id
        ))
        db.commit()
        return {"detail": "Kandungan berhasil diupdate"}
    finally:
        cursor.close()
        db.close()


# ================== ADMIN KRITERIA ==================
class KriteriaInput(BaseModel):
    kode: str
    nama: str
    bobot: Union[str, float]
    tipe: str


@app.get("/admin/kriteria", dependencies=[Depends(verify_admin_token)])
def get_kriteria():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM kriteria")
        return {"data": cursor.fetchall()}

    finally:
        cursor.close()
        db.close()


@app.put("/admin/kriteria/{kode}", dependencies=[Depends(verify_admin_token)])
def update_kriteria(kode: str, data: KriteriaInput):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            UPDATE kriteria
            SET nama=%s, bobot=%s, tipe=%s
            WHERE kode=%s
        """, (
            data.nama,
            data.bobot,
            data.tipe,
            kode
        ))
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Kriteria tidak ditemukan")

        return {"detail": "Kriteria berhasil diupdate"}
    finally:
        cursor.close()
        db.close()


@app.delete("/admin/kriteria/{kode}", dependencies=[Depends(verify_admin_token)])
def delete_kriteria(kode: str):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("DELETE FROM kriteria WHERE kode=%s", (kode,))
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Kriteria tidak ditemukan")

        return {"detail": "Kriteria berhasil dihapus"}
    finally:
        cursor.close()
        db.close()
