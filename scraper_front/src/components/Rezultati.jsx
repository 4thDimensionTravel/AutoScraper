import { useAuto } from '../context/AutoContext'

function Rezultati() {
  const { rezultati, loading, greska } = useAuto()

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Učitavanje...</p>
  }

  if (greska) {
    return <p className="text-center text-red-500 mt-6">{greska}</p>
  }

  if (rezultati === null) {
    return <p className="text-center text-gray-500 mt-6">Unesi podatke i klikni "Proceni vrednost".</p>
  }

  if (rezultati.length === 0) {
    return <p className="text-center text-gray-500 mt-6">Nema pronađenih oglasa za ove parametre.</p>
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Top ponude</h2>
      <div className="flex flex-col gap-3">
        {rezultati.map((auto) => (
          <a
            key={auto.link}
            href={auto.link}
            target="_blank"
            rel="noreferrer"
            className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
          >
            <h3 className="font-medium text-gray-800">{auto.naslov}</h3>
            <p className="text-blue-600 font-semibold mt-1">{auto.cena}</p>
            <p className="text-sm text-gray-500 mt-1">
              {auto.godiste} · {auto.kilometraza} · {auto.snaga}
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Rezultati
