import { useParams } from "react-router-dom"
import { useEffect, useState } from 'react'

function DetailView(){
    const { name } = useParams()
    const [response, setResponse] = useState([])
    const URL = "https://ws.audioscrobbler.com/2.0/"
    const API_KEY = import.meta.env.VITE_LASTFM_KEY


    useEffect(()=>{
    async function fetchMusic(){
        const res = fetch(`${URL}?method=artist.getinfo&artist=${encodeURIComponent(name)}&api_key=${API_KEY}&format=json`)
        const data = await (await res).json()
        setResponse(data.artist.bio.summary)
    }
    fetchMusic()
    },[name])


    return(
    <>
        <h1>{name}</h1>
        <h2>{response}</h2>
    </>
    )
}

export default DetailView