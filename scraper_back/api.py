from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import re

app = FastAPI()

# dozvoljavamo React aplikaciji (localhost:5173) da poziva API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def cena_u_broj(cena):
    # neki oglasi imaju "Rata kredita" u istoj koloni, pa uzimamo samo prvi red
    prva_linija = (cena or "").split("\n")[0]
    return int(re.sub(r"[^\d]", "", prva_linija) or 0)


@app.post("/proceni")
def proceni(podaci: dict):
    marka = podaci.get("marka", "")
    model = podaci.get("model", "")

    conn = sqlite3.connect("automobili.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT naslov, cena, kilometraza, datum_proizvodnje, gorivo, snaga_ks, link FROM oglasi WHERE naslov LIKE ? AND naslov LIKE ?",
        (f"%{marka}%", f"%{model}%"),
    )
    redovi = cursor.fetchall()
    conn.close()

    oglasi = []
    for naslov, cena, kilometraza, godiste, gorivo, snaga, link in redovi:
        oglasi.append({
            "naslov": naslov,
            "cena": cena.split("\n")[0],
            "godiste": godiste,
            "kilometraza": kilometraza,
            "gorivo": gorivo,
            "snaga": snaga,
            "link": link,
        })

    # najjeftiniji prvi
    oglasi.sort(key=lambda x: cena_u_broj(x["cena"]))

    return oglasi[:5]
