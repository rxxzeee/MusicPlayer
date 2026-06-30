import { useState } from 'react'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [currentTrackUrl, setCurrentTrackUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  // Функція для пошуку музики
  const searchMusic = async (e) => {
    e.preventDefault()
    if (!query) return
    
    setLoading(true)
    try {
      // Звертаємося до нашого Python-сервера
      const res = await fetch(`http://127.0.0.1:8000/search?query=${query}`)
      const data = await res.json()
      if (data.status === 'success') {
        setResults(data.data)
      }
    } catch (error) {
      console.error("Помилка пошуку:", error)
    }
    setLoading(false)
  }

  // Функція для відтворення треку
  const playTrack = async (videoId) => {
    setCurrentTrackUrl(null) // Скидаємо попередній трек на час завантаження
    try {
      // Звертаємося до сервера за прямим посиланням на аудіо
      const res = await fetch(`http://127.0.0.1:8000/stream/${videoId}`)
      const data = await res.json()
      if (data.status === 'success') {
        setCurrentTrackUrl(data.stream_url)
      }
    } catch (error) {
      console.error("Помилка завантаження треку:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans pb-32">
      {/* --- ЗОНА ДЛЯ ПЕРЕТЯГУВАННЯ ВІКНА --- */}
      <div className="fixed top-0 left-0 w-full h-8 drag-area z-50"></div>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-green-400 tracking-tight">Мій Музичний Плеєр</h1>
        
        {/* Форма пошуку */}
        <form onSubmit={searchMusic} className="flex gap-3 mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Що будемо слухати?"
            className="flex-1 p-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition"
          />
          <button 
            type="submit" 
            className="bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-4 px-8 rounded-xl transition shadow-lg shadow-green-500/20"
          >
            {loading ? 'Шукаю...' : 'Знайти'}
          </button>
        </form>

        {/* Результати пошуку */}
        <div className="space-y-3">
          {results.map((track) => (
            <div 
              key={track.videoId} 
              className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700 cursor-pointer transition border border-transparent hover:border-gray-600"
              onClick={() => playTrack(track.videoId)}
            >
              <img src={track.thumbnail} alt={track.title} className="w-14 h-14 rounded-lg object-cover shadow-md" />
              <div className="flex-1 truncate">
                <h3 className="font-semibold text-lg truncate text-gray-100">{track.title}</h3>
                <p className="text-gray-400 text-sm truncate">{track.artist.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Нижня панель плеєра */}
      {currentTrackUrl && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-950 p-4 border-t border-gray-800 shadow-2xl flex justify-center backdrop-blur-lg bg-opacity-90">
          <div className="w-full max-w-2xl">
            <audio 
              controls 
              autoPlay 
              src={currentTrackUrl} 
              className="w-full h-12 outline-none rounded-lg"
            >
              Ваш браузер не підтримує аудіо елемент.
            </audio>
          </div>
        </div>
      )}
    </div>
  )
}

export default App