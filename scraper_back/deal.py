import sqlite3
import pandas as pd
import numpy as np
import re
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

print("Učitavam podatke iz baze...")
conn = sqlite3.connect("automobili.db")
df = pd.read_sql_query("SELECT * FROM oglasi", conn)
conn.close()

df['cena'] = pd.to_numeric(df['cena'].astype(str).str.replace(r'[^\d]', '', regex=True), errors='coerce')
df = df[ (df['cena'] > 500) & (df['cena'] < 100000) ]

df['kilometraza'] = df['kilometraza'].astype(str).str.replace(r'[^\d]', '', regex=True)
df['kilometraza'] = pd.to_numeric(df['kilometraza'], errors='coerce')

df['datum_proizvodnje'] = pd.to_numeric(df['datum_proizvodnje'], errors='coerce')


def ocisti_snagu(text):
    if pd.isna(text): return 0
    text = str(text)
    match = re.search(r'(\d+)\s*KS', text)
    if match:
        return int(match.group(1))
    
    if text.isdigit():
        return int(text)
    return 0

df['snaga'] = df['snaga_ks'].apply(ocisti_snagu)

df = df.dropna(subset=['cena', 'datum_proizvodnje', 'kilometraza'])
df = df[df['cena'] > 1000] 



def ima_oznaku(text, keywords):
    if not isinstance(text, str): return 0
    text = text.lower()
    for key in keywords:
        if key in text:
            return 1
    return 0

df['is_quattro'] = df['naslov'].apply(lambda x: ima_oznaku(x, ['quattro', '4x4', '4wd']))
df['is_automatic'] = df['naslov'].apply(lambda x: ima_oznaku(x, ['automatik', 'automatic', 's-tronic', 'stronic', 'tiptronic', 'dsg']))
df['is_s_line'] = df['naslov'].apply(lambda x: ima_oznaku(x, ['s-line', 's line', 'sline']))
df['is_nav'] = df['naslov'].apply(lambda x: ima_oznaku(x, ['nav', 'navi', 'gps', 'map']))

print(f"Treniram model na {len(df)} automobila...")

features = ['datum_proizvodnje', 'kilometraza', 'snaga', 'is_quattro', 'is_automatic', 'is_s_line', 'is_nav']
target = 'cena'

X = df[features].fillna(0) 
y = df[target]

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)


df['procenjena_cena'] = model.predict(X)


df['usteda'] = df['procenjena_cena'] - df['cena']
df['usteda_procenat'] = (df['usteda'] / df['procenjena_cena']) * 100

top_deals = df.sort_values(by='usteda_procenat', ascending=False).head(10)


print("\n" + "="*50)
print("TOP 5 NAJBOLJIH PRILIKA (DEAL HUNTER)")
print("="*50)

for index, row in top_deals.head(5).iterrows():
    print(f"VOZILO: {row['naslov']}")
    print(f"Link: {row['link']}")
    print(f"Godište: {row['datum_proizvodnje']} | KM: {row['kilometraza']} | Snaga: {row['snaga']} KS")
    print(f"CENA: {row['cena']:.0f} €")
    print(f"REALNA VREDNOST: {row['procenjena_cena']:.0f} €")
    print(f"💰 UŠTEDA: {row['usteda']:.0f} € ({row['usteda_procenat']:.1f}%)")
    print("-" * 50)

plt.figure(figsize=(12, 6))

sns.scatterplot(data=df, x='kilometraza', y='cena', alpha=0.6, label='Tržište')

sns.scatterplot(data=top_deals.head(5), x='kilometraza', y='cena', color='red', s=100, label='TOP PRILIKE')

plt.title('Deal Hunter: Odnos cene i kilometraže (Crveno = Best Buy)')
plt.xlabel('Kilometraža')
plt.ylabel('Cena (€)')
plt.legend()
plt.grid(True)
plt.show()


vaznost = pd.Series(model.feature_importances_, index=features).sort_values(ascending=False)

print("\n" + "="*50)
print("ŠTA NAJVIŠE UTIČE NA CENU? (Feature Importance)")
print("="*50)
print(vaznost)

plt.figure(figsize=(10,6))
sns.barplot(x=vaznost, y=vaznost.index)
plt.title("Šta tvom modelu najviše znači?")
plt.xlabel("Uticaj na cenu (0-1)")
plt.show()