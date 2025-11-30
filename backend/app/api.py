from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.topsis import hitung_topsis
import uvicorn
import pandas as pd
import numpy as np
from dotenv import load_dotenv
import os

# Load .env 
load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==== MODEL DATA ====
class InputData(BaseModel):
    jenisKulit: str

# ==== ROUTE UTAMA ====
@app.get("/")
def home():
    return {"message": "API SPK Skincare aktif ✅"}

# ==== ROUTE ANALISIS ====
@app.post("/analyze")
def analyze(data: InputData):
    """
    Endpoint ini menerima input jenis kulit,
    lalu memanggil fungsi hitung_topsis() untuk menghasilkan rekomendasi skincare.
    """
    hasil = hitung_topsis(data)
    return {"status": "success", "data": hasil}


# ==== RUNNING ====
if __name__ == "__main__":
    uvicorn.run("app.api:app", host="127.0.0.1", port=8000, reload=True)
