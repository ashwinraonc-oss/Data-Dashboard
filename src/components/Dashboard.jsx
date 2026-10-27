import { useEffect, useState } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Pie, PieChart, Cell, Legend } from 'recharts'

const PIE_COLORS = ['#aa3bff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
const OTHER_COLOR = '#9ca3af'

function Dashboard() {
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
  const topPlays = [...filtered_listeners]
  .sort((a, b) => Number(b.playcount) - Number(a.playcount))
  .slice(0, 10)
  .map(a => ({ name: a.name, plays: Number(a.playcount) }))
  const topFive = topPlays.slice(0, 5)
  const topFivePlays = topFive.reduce((sum, a) => sum + a.plays, 0)
  const otherPlays = totalPlays - topFivePlays
  const pieData = otherPlays > 0
    ? [...topFive, { name: "Everyone else", plays: otherPlays }]
    : topFive

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

      <div className="chart-card">
        <h2>Top 10 artists by total plays</h2>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={topPlays} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis
              type="number"
              tickFormatter={(v) => new Intl.NumberFormat('en', { notation: 'compact' }).format(v)}
              stroke="var(--text)"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              interval={0}
              stroke="var(--text)"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--accent-bg)' }}
              formatter={(v) => [v.toLocaleString(), 'Plays']}
              contentStyle={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text-h)',
              }}
            />
            <Bar dataKey="plays" fill="var(--accent)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-card">
        <h2>How much of the charts do the top 5 artists own?</h2>
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="plays"
              nameKey="name"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              stroke="var(--bg)"
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
            >
              {pieData.map((slice, i) => (
                <Cell
                  key={slice.name}
                  fill={slice.name === "Everyone else" ? OTHER_COLOR : PIE_COLORS[i % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => [v.toLocaleString(), 'Plays']}
              contentStyle={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text-h)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
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
                <td>
                    <Link to = {`/artist/${encodeURIComponent(r.name)}`}>{r.name}</Link>
                </td>
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

export default Dashboard