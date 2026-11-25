import { useAuto } from '../context/AutoContext'

function Rezultati() {
  const { podaci, loading } = useAuto()

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Učitavanje...</p>
  }

  if (!podaci) {
    return <p className="text-center text-gray-500 mt-6">Unesi podatke i klikni "Proceni vrednost".</p>
  }

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Poslati podaci</h2>
      <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(podaci, null, 2)}</pre>
    </div>
  )
}

export default Rezultati
