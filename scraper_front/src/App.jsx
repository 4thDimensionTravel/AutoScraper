import Forma from './components/Forma'
import Rezultati from './components/Rezultati'

function App() {
  return (
    <div className="max-w-md mx-auto my-10 px-5">
      <h1 className="text-center text-4xl mb-2">AutoScraper</h1>
      <p className="text-center text-gray-500 mb-6">Unesi podatke vozila da proceniš njegovu realnu vrednost</p>

      <Forma />
      <Rezultati />
    </div>
  )
}

export default App
