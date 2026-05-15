import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Result from './pages/Result.jsx'
import Roadmaps from './pages/Roadmaps.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/roadmaps" element={<Roadmaps />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)