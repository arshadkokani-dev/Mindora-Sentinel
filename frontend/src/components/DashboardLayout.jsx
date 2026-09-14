import { Outlet } from 'react-router-dom'
import DashboardNav from './DashboardNav'

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <DashboardNav />

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout