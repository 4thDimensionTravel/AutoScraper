import sqlite3

class Baza:
    def __init__(self, db_name="automobili.db"):
        self.conn = sqlite3.connect(db_name)
        self.cursor = self.conn.cursor()
        self.kreiraj_tabelu()

    def kreiraj_tabelu(self):
        query = """
        CREATE TABLE IF NOT EXISTS oglasi (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            naslov TEXT,
            cena TEXT,
            kilometraza TEXT,
            datum TEXT,
            datum_proizvodnje TEXT,
            karoserija TEXT,
            gorivo TEXT,
            kubikaza TEXT,
            snaga_ks TEXT,
            link TEXT,
            datum_unosa DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
        self.cursor.execute(query)
        self.conn.commit()

    def ubaci_oglas(self, naslov, cena, kilometraza, datum, datum_proizvodnje, karoserija, gorivo, kubikaza, snaga, link):
        query = """
        INSERT INTO oglasi (naslov, cena, kilometraza, datum, datum_proizvodnje, karoserija, gorivo, kubikaza, snaga_ks, link)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        try:
            self.cursor.execute(query, (naslov, cena, kilometraza, datum, datum_proizvodnje, karoserija, gorivo, kubikaza, snaga, link))
            self.conn.commit()
        except sqlite3.Error as e:
            print(f"Greška pri upisu u bazu: {e}")

    def zatvori(self):
        self.conn.close()