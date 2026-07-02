import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import { AboutPage } from './pages/AboutPage.tsx'
import { HomePage } from './pages/HomePage.tsx'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Portfolio Client</h1>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
