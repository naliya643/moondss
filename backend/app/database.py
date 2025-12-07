import mysql.connector

def get_db():
    db = mysql.connector.connect(
        host="localhost",
        user="root",       # user XAMPP kamu
        password="",       # password MySQL (biasanya kosong)
        database="spk_skincare"
    )
    return db
