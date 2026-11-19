import sqlite3
import pandas as pd

conn = sqlite3.connect("automobili.db") 

df = pd.read_sql_query("SELECT * FROM oglasi", conn)

conn.close()

print("--- PRVIH 5 REDOVA ---")
print(df.head()) 

print("\n--- INFORMACIJE O KOLONAMA ---")
print(df.info())

print("\n--- UKUPNO OGLASA ---")
print(len(df))