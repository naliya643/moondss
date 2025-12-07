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
from fastapi import UploadFile, File, Form
import shutil


# Load .env 
load_dotenv()

app = FastAPI()

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

# ==== MODEL LOGIN ====
class LoginInput(BaseModel):
    username: str
    password: str

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

from fastapi import APIRouter, Depends, UploadFile, File # Import yang diperlukan

# ... import lainnya ...

# Tambahkan router/endpoint untuk Produk
# Karena kamu menggunakan token, ini harus dilindungi (auth)
# Ini contoh sederhana tanpa auth lengkap:

@app.get("/admin/produk")
def get_all_produk():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        # Query untuk mengambil semua data produk
        cursor.execute("SELECT id, nama, kandungan, harga, foto, deskripsi FROM produk")
        products = cursor.fetchall()
        # Jika kamu ingin mengembalikan 'data': {...}
        # return {"data": products}
        # Tapi karena kode frontend kamu bisa menerima array langsung, ini lebih simple:
        return products
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
    foto: UploadFile = File(...)
):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Simpan file foto
        upload_dir = "static/photos"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, foto.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        
        # Simpan ke database
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
            
            file_path = os.path.join(upload_dir, foto.filename)
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