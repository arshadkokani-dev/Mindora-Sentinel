import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function DashboardNav() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
      
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="sidebar-brand">
          <span className="sidebar-logo">M</span>

          {!collapsed && (
            <div className="sidebar-brand-text">
              <strong>Mindora</strong>
              <span>Sentinel</span>
            </div>
          )}
        </NavLink>

        <button
          type="button"
          className="sidebar-collapse-button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-navigation">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <span className="sidebar-icon">⌂</span>
          {!collapsed && <span>Overview</span>}
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <span className="sidebar-icon">◫</span>
          {!collapsed && <span>Analytics</span>}
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <span className="sidebar-icon">◷</span>
          {!collapsed && <span>History</span>}
        </NavLink>

        <div className="sidebar-divider" />

        <NavLink
          to="/checkin"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <span className="sidebar-icon">✓</span>
          {!collapsed && <span>Check-in</span>}
        </NavLink>

        <NavLink
          to="/cbt-journal"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <span className="sidebar-icon">✎</span>
          {!collapsed && <span>CBT Journal</span>}
        </NavLink>

      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <>
            <span className="sidebar-footer-dot" />
            <span>Wellness & Support</span>
          </>
        )}
      </div>

    </aside>
  )
}

export default DashboardNav