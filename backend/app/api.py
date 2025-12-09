from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.topsis import hitung_topsis
from app.database import get_db

import uvicorn
import pandas as pd
import numpy as np
from dotenv import load_dotenv
import os
from fastapi import Path, HTTPException
from fastapi import UploadFile, File, Form, Body
import shutil
import time
from fastapi.staticfiles import StaticFiles
from decimal import Decimal
import datetime
from typing import Union, Optional


# Load .env 
load_dotenv()

app = FastAPI()

# Mount static folder so frontend can access uploaded photos
app.mount("/static", StaticFiles(directory="static"), name="static")

# ==== CORS ====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==== MODEL DATA TOPSIS ====
class InputData(BaseModel):
    jenisKulit: str

# ==== MODEL KANDUNGAN ====
class KandunganInput(BaseModel):
    nama_kandungan: str
    deskripsi: str
    c1: Union[str, float]
    c2: Union[str, float]
    c3: Union[str, float]
    c4: Union[str, int, float]

# ==== ROUTE UTAMA ====
@app.get("/")
def home():
    return {"message": "API SPK Skincare aktif ✅"}

# ==== ROUTE ANALISIS (TOPSIS) ====
@app.post("/analyze")
def analyze(data: InputData):
    """
    Endpoint ini menerima input jenis kulit,
    lalu memanggil fungsi hitung_topsis() untuk menghasilkan rekomendasi skincare.
    """
    hasil = hitung_topsis(data)
    return {"status": "success", "data": hasil}

# Tambahkan ini di file FastAPI (app/main.py atau file utama)

from fastapi import APIRouter, Depends

# Tambahkan router/endpoint untuk Produk
# Karena kamu menggunakan token, ini harus dilindungi (auth)
# Ini contoh sederhana tanpa auth lengkap:

@app.get("/admin/produk")
def get_all_produk():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        # Query untuk mengambil semua data produk
        cursor.execute("SELECT id, nama, harga, kandungan, foto, deskripsi FROM produk")
        products = cursor.fetchall()
        # Normalisasi tipe data agar JSON serializable
        products = products or []
        sanitized = []
        for r in products:
            for k, v in list(r.items()):
                if isinstance(v, Decimal):
                    # cast Decimal to float (harga biasanya numeric)
                    r[k] = float(v)
                elif isinstance(v, (datetime.date, datetime.datetime)):
                    r[k] = v.isoformat()
                elif isinstance(v, bytes):
                    try:
                        r[k] = v.decode('utf-8')
                    except Exception:
                        r[k] = str(v)
            sanitized.append(r)

        # Kembalikan object konsisten agar frontend mudah menangani
        print(f"GET /admin/produk -> fetched {len(sanitized)} rows")
        return {"data": sanitized}
    except Exception as e:
        print(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Gagal mengambil data produk dari DB")
    finally:
        cursor.close()
        db.close()
        
# Tambahkan juga route POST dan DELETE (untuk handleAdd dan handleDelete)
# --- ROUTE TAMBAH (POST) ---
@app.post("/admin/produk")
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
        # Simpan file foto jika disertakan
        foto_path = None
        if foto is not None:
            upload_dir = "static/photos"
            os.makedirs(upload_dir, exist_ok=True)

            # sanitize filename and prefix with timestamp to avoid collisions
            filename = f"{int(time.time())}_{os.path.basename(foto.filename)}"
            file_path = os.path.join(upload_dir, filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(foto.file, buffer)

            # Simpan ke database (path relatif untuk diakses frontend)
            foto_path = f"/{file_path}"
        cursor.execute(
            "INSERT INTO produk (nama, kandungan, harga, foto, deskripsi) VALUES (%s, %s, %s, %s, %s)",
            (nama, kandungan, harga, foto_path, deskripsi)
        )
        db.commit()
        
        return {"detail": "Produk berhasil ditambahkan", "id": cursor.lastrowid}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gagal menambah produk: {e}")
    finally:
        cursor.close()
        db.close()

# --- ROUTE EDIT (PUT) ---
@app.put("/admin/produk/{produk_id}")
async def update_produk(
    produk_id: int = Path(..., alias="produk_id"),
    nama: str = Form(None),
    kandungan: str = Form(None),
    harga: int = Form(None),
    deskripsi: str = Form(None),
    foto: UploadFile = File(None)
):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Ambil data produk yang ada
        cursor.execute("SELECT * FROM produk WHERE id = %s", (produk_id,))
        produk = cursor.fetchone()
        
        if not produk:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
        
        # Update foto jika ada file baru
        foto_path = produk['foto']
        if foto:
            # Hapus foto lama
            if produk['foto']:
                old_path = produk['foto'][1:]
                if os.path.exists(old_path):
                    os.remove(old_path)
            
            # Simpan foto baru
            upload_dir = "static/photos"
            os.makedirs(upload_dir, exist_ok=True)
            
            # sanitize filename and prefix with timestamp to avoid collisions
            filename = f"{int(time.time())}_{os.path.basename(foto.filename)}"
            file_path = os.path.join(upload_dir, filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(foto.file, buffer)
            
            foto_path = f"/{file_path}"
        
        # Update database
        cursor.execute(
            "UPDATE produk SET nama = %s, kandungan = %s, harga = %s, foto = %s, deskripsi = %s WHERE id = %s",
            (nama or produk['nama'], kandungan or produk['kandungan'], 
             harga or produk['harga'], foto_path, deskripsi or produk['deskripsi'], produk_id)
        )
        db.commit()
        
        return {"detail": "Produk berhasil diperbarui"}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gagal memperbarui produk: {e}")
    finally:
        cursor.close()
        db.close()

# --- ROUTE HAPUS (DELETE) ---
@app.delete("/admin/produk/{produk_id}")
def delete_produk(produk_id: int = Path(..., alias="produk_id")):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # 1. Ambil path foto dulu
        cursor.execute("SELECT foto FROM produk WHERE id = %s", (produk_id,))
        produk = cursor.fetchone()
        
        if not produk:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
            
        # 2. Hapus foto dari server jika ada
        if produk['foto']:
            # Hilangkan slash pertama ('/') untuk path lokal
            local_path = produk['foto'][1:] 
            if os.path.exists(local_path):
                os.remove(local_path)
        
        # 3. Hapus produk dari DB
        cursor.execute("DELETE FROM produk WHERE id = %s", (produk_id,))
        db.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Gagal menghapus produk, ID tidak valid")
            
        return {"detail": "Produk berhasil dihapus"}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gagal menghapus produk: {e}")
    finally:
        cursor.close()
        db.close()

# ==== ROUTE KANDUNGAN (CRUD) ====
@app.get("/admin/kandungan")
def get_all_kandungan():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, nama_kandungan, deskripsi, c1, c2, c3, c4 FROM kandungan")
        kandungan_list = cursor.fetchall() or []
        sanitized = []
        for r in kandungan_list:
            for k, v in list(r.items()):
                if isinstance(v, Decimal):
                    r[k] = float(v)
                elif isinstance(v, (datetime.date, datetime.datetime)):
                    r[k] = v.isoformat()
                elif isinstance(v, bytes):
                    try:
                        r[k] = v.decode('utf-8')
                    except Exception:
                        r[k] = str(v)
            sanitized.append(r)

        print(f"GET /admin/kandungan -> fetched {len(sanitized)} rows")
        return {"data": sanitized}
    except Exception as e:
        print(f"Error fetching kandungan: {e}")
        raise HTTPException(status_code=500, detail="Gagal mengambil data kandungan dari DB")
    finally:
        cursor.close()
        db.close()

@app.post("/admin/kandungan")
def add_kandungan(kandungan: KandunganInput):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        print(f"POST /admin/kandungan -> payload: {kandungan.dict()}")
        cursor.execute(
            "INSERT INTO kandungan (nama_kandungan, deskripsi, c1, c2, c3, c4) VALUES (%s, %s, %s, %s, %s, %s)",
            (kandungan.nama_kandungan, kandungan.deskripsi, kandungan.c1, kandungan.c2, kandungan.c3, kandungan.c4)
        )
        db.commit()
        print(f"POST /admin/kandungan -> inserted id: {cursor.lastrowid}")
        
        return {"detail": "Kandungan berhasil ditambahkan", "id": cursor.lastrowid}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gagal menambah kandungan: {e}")
    finally:
        cursor.close()
        db.close()

@app.put("/admin/kandungan/{kandungan_id}")
def update_kandungan(
    kandungan_id: int = Path(...),
    kandungan: KandunganInput = Body(...)
):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        print(f"PUT /admin/kandungan/{kandungan_id} -> incoming payload: {kandungan.dict() if kandungan else None}")
        print(f"PUT /admin/kandungan/{kandungan_id} -> payload detail: nama_kandungan={kandungan.nama_kandungan}, deskripsi={kandungan.deskripsi}, c1={kandungan.c1}, c2={kandungan.c2}, c3={kandungan.c3}, c4={kandungan.c4}")
        cursor.execute("SELECT * FROM kandungan WHERE id = %s", (kandungan_id,))
        existing = cursor.fetchone()
        
        if not existing:
            print(f"PUT /admin/kandungan/{kandungan_id} -> ID not found")
            raise HTTPException(status_code=404, detail="Kandungan tidak ditemukan")
        
        # Gunakan data dari request (jangan fallback ke existing, update semua field)
        nama_kandungan = kandungan.nama_kandungan
        deskripsi = kandungan.deskripsi
        c1 = kandungan.c1
        c2 = kandungan.c2
        c3 = kandungan.c3
        c4 = kandungan.c4
        
        print(f"PUT /admin/kandungan/{kandungan_id} -> updating with: nama_kandungan={nama_kandungan}, deskripsi={deskripsi}, c1={c1}, c2={c2}, c3={c3}, c4={c4}")
        cursor.execute(
            "UPDATE kandungan SET nama_kandungan = %s, deskripsi = %s, c1 = %s, c2 = %s, c3 = %s, c4 = %s WHERE id = %s",
            (nama_kandungan, deskripsi, c1, c2, c3, c4, kandungan_id)
        )
        db.commit()
        print(f"PUT /admin/kandungan/{kandungan_id} -> update complete")
        
        return {"detail": "Kandungan berhasil diperbarui"}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gagal memperbarui kandungan: {e}")
    finally:
        cursor.close()
        db.close()

@app.delete("/admin/kandungan/{kandungan_id}")
def delete_kandungan(kandungan_id: int = Path(...)):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        cursor.execute("DELETE FROM kandungan WHERE id = %s", (kandungan_id,))
        db.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Kandungan tidak ditemukan")
            
        return {"detail": "Kandungan berhasil dihapus"}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gagal menghapus kandungan: {e}")
    finally:
        cursor.close()
        db.close()