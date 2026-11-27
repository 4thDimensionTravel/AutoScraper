import { useState } from 'react'
import { useAuto } from '../context/AutoContext'

const API_URL = 'http://localhost:8000/proceni'

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

function Forma() {
  const { setRezultati, setLoading, setGreska, loading } = useAuto()

  const [marka, setMarka] = useState('')
  const [model, setModel] = useState('')
  const [gorivo, setGorivo] = useState('')
  const [godiste, setGodiste] = useState('')
  const [kilometraza, setKilometraza] = useState('')
  const [snaga, setSnaga] = useState('')

  const posalji = async (event) => {
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
    setGreska('')

    try {
      const odgovor = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(podaci),
      })
      const rezultati = await odgovor.json()
      setRezultati(rezultati)
    } catch {
      setRezultati(null)
      setGreska('Greška pri povezivanju sa serverom.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-3.5" onSubmit={posalji}>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Marka</label>
        <select className="px-2.5 py-2 border border-gray-300 rounded-md text-base" value={marka} onChange={(e) => { setMarka(e.target.value); setModel('') }}>
          <option value="">Izaberi marku</option>
          {marke.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Model</label>
        <select className="px-2.5 py-2 border border-gray-300 rounded-md text-base" value={model} onChange={(e) => setModel(e.target.value)} disabled={!marka}>
          <option value="">Izaberi model</option>
          {(modeli[marka] || []).map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Gorivo</label>
        <select className="px-2.5 py-2 border border-gray-300 rounded-md text-base" value={gorivo} onChange={(e) => setGorivo(e.target.value)}>
          <option value="">Izaberi gorivo</option>
          {goriva.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Godište</label>
        <input className="px-2.5 py-2 border border-gray-300 rounded-md text-base" type="number" min="1990" max="2026" value={godiste} onChange={(e) => setGodiste(e.target.value)} placeholder="npr. 2015" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Kilometraža (km)</label>
        <input className="px-2.5 py-2 border border-gray-300 rounded-md text-base" type="number" min="0" value={kilometraza} onChange={(e) => setKilometraza(e.target.value)} placeholder="npr. 120000" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Snaga (KS)</label>
        <input className="px-2.5 py-2 border border-gray-300 rounded-md text-base" type="number" min="50" max="500" value={snaga} onChange={(e) => setSnaga(e.target.value)} placeholder="npr. 150" />
      </div>

      <button className="py-3 rounded-md bg-blue-600 text-white text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" type="submit" disabled={loading}>
        {loading ? 'Učitavanje...' : 'Proceni vrednost'}
      </button>
    </form>
  )
}

export default Forma
