import { useState } from 'react'
import './App.css'

const marke = ['Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Opel', 'Renault', 'Škoda', 'Toyota']

const modeli = {
  'Audi': ['A3', 'A4', 'A6', 'Q5'],
  'BMW': ['Serija 1', 'Serija 3', 'Serija 5', 'X3'],
  'Mercedes-Benz': ['A klasa', 'C klasa', 'E klasa', 'GLC'],
  'Volkswagen': ['Golf', 'Passat', 'Polo', 'Tiguan'],
  'Opel': ['Astra', 'Corsa', 'Insignia', 'Mokka'],
  'Renault': ['Clio', 'Megane', 'Captur', 'Kadjar'],
  'Škoda': ['Fabia', 'Octavia', 'Superb', 'Kodiaq'],
  'Toyota': ['Yaris', 'Corolla', 'RAV4', 'Auris'],
}

const goriva = ['Benzin', 'Dizel', 'Benzin + Gas', 'Hibrid', 'Električni']

function App() {
  const [marka, setMarka] = useState('')
  const [model, setModel] = useState('')
  const [gorivo, setGorivo] = useState('')
  const [godiste, setGodiste] = useState('')
  const [kilometraza, setKilometraza] = useState('')
  const [snaga, setSnaga] = useState('')
  const [loading, setLoading] = useState(false)
  const [poruka, setPoruka] = useState('')

  const posalji = (event) => {
    event.preventDefault()

    const podaci = {
      marka,
      model,
      gorivo,
      godiste: Number(godiste),
      kilometraza: Number(kilometraza),
      snaga: Number(snaga),
    }

    setLoading(true)
    setPoruka('')

    // ovde ce kasnije ici slanje podataka na backend (fetch)
    setTimeout(() => {
      console.log('Podaci za slanje:', podaci)
      setLoading(false)
      setPoruka('Podaci su spremni za slanje.')
    }, 1500)
  }

  return (
    <div className="app">
      <h1>AutoScraper</h1>
      <p>Unesi podatke vozila da proceniš njegovu realnu vrednost</p>

      <form className="forma" onSubmit={posalji}>
        <div className="polje">
          <label>Marka</label>
          <select value={marka} onChange={(e) => { setMarka(e.target.value); setModel('') }}>
            <option value="">Izaberi marku</option>
            {marke.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="polje">
          <label>Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!marka}>
            <option value="">Izaberi model</option>
            {(modeli[marka] || []).map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="polje">
          <label>Gorivo</label>
          <select value={gorivo} onChange={(e) => setGorivo(e.target.value)}>
            <option value="">Izaberi gorivo</option>
            {goriva.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div className="polje">
          <label>Godište</label>
          <input type="number" min="1990" max="2026" value={godiste} onChange={(e) => setGodiste(e.target.value)} placeholder="npr. 2015" />
        </div>

        <div className="polje">
          <label>Kilometraža (km)</label>
          <input type="number" min="0" value={kilometraza} onChange={(e) => setKilometraza(e.target.value)} placeholder="npr. 120000" />
        </div>

        <div className="polje">
          <label>Snaga (KS)</label>
          <input type="number" min="50" max="500" value={snaga} onChange={(e) => setSnaga(e.target.value)} placeholder="npr. 150" />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Učitavanje...' : 'Proceni vrednost'}
        </button>
      </form>

      {poruka && <p className="poruka">{poruka}</p>}
    </div>
  )
}

export default App
