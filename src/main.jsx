import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Home from './pages/Home.jsx'
import Result from './pages/Result.jsx'
import Roadmaps from './pages/Roadmaps.jsx'
import Templates from './pages/Templates.jsx'
import './index.css'
import { migrateLegacyLimits } from './utils/generationLimits.js'

migrateLegacyLimits()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/templates" element={<Templates />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)