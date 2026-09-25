import { Outlet } from 'react-router-dom'
import DashboardNav from './DashboardNav'
import Chatbot from './Chatbot'

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <DashboardNav />

      <main className="dashboard-content">
        <Outlet />
      </main>

      <Chatbot />
    </div>
  )
}

export default DashboardLayout