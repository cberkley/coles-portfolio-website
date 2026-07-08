import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import { AboutPage } from './pages/AboutPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { ProfessionalProjectsPage } from './pages/ProfessionalProjects.tsx';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>My Portfolio Website</h1>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/professional-projects">Professional Projects</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/professional-projects" element={<ProfessionalProjectsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
