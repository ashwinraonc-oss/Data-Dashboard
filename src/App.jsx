import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const URL = "https://ws.audioscrobbler.com/2.0/"
  const API_KEY = import.meta.env.VITE_LASTFM_KEY
  const [response, setResponse] = useState([])
  const [search, setSearch] = useState("")
  const [listenerSearch, setListenerSearch] = useState("")


  useEffect(()=>{
    async function fetchMusic(){
      const res = fetch(`${URL}?method=chart.gettopartists&api_key=${API_KEY}&format=json`)
      const data = await (await res).json()
      setResponse(data.artists.artist)
    }
    fetchMusic()
  },[])

  console.log(response)

  const filtered_list = response.filter(artist => artist.name.toLowerCase().includes(search.toLowerCase()))
  const filtered_listeners = filtered_list.filter(artist => Number(artist.listeners) >= Number(listenerSearch))
  const totalPlays = filtered_listeners.reduce((sum, p) => sum + Number(p.playcount), 0)
  const totalListeners = filtered_listeners.reduce((sum, p) => sum + Number(p.listeners), 0)
  const count = filtered_listeners.length
  const avgPlays = count ? Math.round(totalPlays / count) : 0
  const avgListeners = count ? Math.round(totalListeners / count) : 0

  return (
    <div className="dashboard">
      <h1>Top Artists</h1>

      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-label">Number of Artists</span>
          <span className="stat-value">{filtered_list.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Plays</span>
          <span className="stat-value">{avgPlays.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Listeners</span>
          <span className="stat-value">{avgListeners.toLocaleString()}</span>
        </div>
      </div>

      <input
        className="search"
        type="text"
        placeholder="Search artists..."
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <input
        className="listener-search"
        type="text"
        placeholder="Enter min # of listeners..."
        onChange={(e) => setListenerSearch(e.target.value)}
        value={listenerSearch}
      />

      <div className="data-container">
        <table>
          <thead>
            <tr>
              <th>Artist</th>
              <th className="num">Plays</th>
              <th className="num">Listeners</th>
            </tr>
          </thead>
          <tbody>
            {filtered_listeners.map(r =>
              <tr key={r.name}>
                <td>{r.name}</td>
                <td className="num">{Number(r.playcount).toLocaleString()}</td>
                <td className="num">{Number(r.listeners).toLocaleString()}</td>
              </tr>)}
          </tbody>
        </table>
        {count === 0 && <p className="empty">No artists match your search.</p>}
      </div>
    </div>
  )
}

export default App
