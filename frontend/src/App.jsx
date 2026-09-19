import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import WellnessCheckin from './components/WellnessCheckin'
import CBTJournal from './components/CBTJournal'
import Analytics from './components/Analytics'
import History from './components/History'
import DashboardLayout from './components/DashboardLayout'
import './App.css'
import CommandCenter from './components/CommandCenter'
import CaseDetails from './components/CaseDetails'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/history" element={<History />} />
            <Route path="/checkin" element={<WellnessCheckin />} />
            <Route path="/cbt-journal" element={<CBTJournal />} />
            <Route path="/command-center" element={<CommandCenter />} />
            <Route path="/command-center/:caseId" element={<CaseDetails />} />
          </Route>

          <Route
            path="/"
            element={<Navigate to="/signup" replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App