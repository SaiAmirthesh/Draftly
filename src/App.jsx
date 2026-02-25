import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MainPage from './pages/MainPage'
import ProfilePage from './pages/ProfilePage'
import DraftPage from './pages/DraftPage'
import ThemeToggle from './components/ThemeToggle'
import { NotificationProvider } from './components/notification'

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/draft/:id" element={<DraftPage />} />
        </Routes>
        <ThemeToggle />
      </Router>
    </NotificationProvider>
  )
}

export default App
