import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import DetailView from './components/DetailView'

function App(){
  return (
    <Routes>
      <Route path = "/" element = {<Dashboard/>}/>
      <Route path = "/artist/:name" element = {<DetailView/>}></Route>
    </Routes>
  )
}

export default App
