import { useEffect, useState } from 'react'
import '../styles/commandCenter.css'
import { useNavigate } from 'react-router-dom'

function CommandCenter() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCommandCenter = async () => {
      try {
        const token = localStorage.getItem('token')

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const casesResponse = await fetch(
          'http://localhost:5000/api/cases',
          { headers }
        )

        const casesResult = await casesResponse.json()

        if (!casesResponse.ok) {
          throw new Error(
            casesResult.message || 'Failed to load Command Center'
          )
        }

        setData(casesResult)

        const alertsResponse = await fetch(
          'http://localhost:5000/api/alerts',
          { headers }
        )

        const alertsResult = await alertsResponse.json()

        if (!alertsResponse.ok) {
          throw new Error(
            alertsResult.message || 'Failed to load alerts'
          )
        }

        setAlerts(alertsResult.alerts || [])

        const interventionsResponse = await fetch(
        'http://localhost:5000/api/interventions',
        { headers }
      )

      const interventionsResult = await interventionsResponse.json()

      if (!interventionsResponse.ok) {
        throw new Error(
          interventionsResult.message || 'Failed to load interventions'
        )
      }

      setInterventions(interventionsResult.interventions || [])
      } catch (error) {
        console.error('Command Center error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCommandCenter()
  }, [])

  const updateAlert = async (alertId, action, actionNote = '') => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:5000/api/alerts/${alertId}/${action}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ actionNote }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to update alert'
        )
      }

      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) =>
          alert._id === alertId ? result.alert : alert
        )
      )
    } catch (error) {
      console.error('Alert update error:', error)
      setError(error.message)
    }
}

  if (loading) {
    return (
      <main className="command-center-page">
        <div className="command-center-state">
          <p>Loading Command Center...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="command-center-page">
        <div className="command-center-state error">
          <h2>Unable to load Command Center</h2>
          <p>{error}</p>
        </div>
      </main>
    )
  }

  const summary = data?.summary || {}
  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }

  const cases = [...(data?.cases || [])].sort(
    (a, b) =>
      (priorityOrder[a.priority] ?? 4) -
      (priorityOrder[b.priority] ?? 4)
  )

  return (
    <div className="command-center-page">
      <header className="command-center-header">
        <div>
          <span className="metric-label">CASE MANAGEMENT</span>
          <h1>Command Center</h1>
          <p>
            Monitor case status, risk signals, engagement,
            and follow-up requirements.
          </p>
        </div>
      </header>

      <section className="command-summary">
        <div className="command-summary-card">
          <span>Total Cases</span>
          <strong>{summary.totalCases ?? 0}</strong>
        </div>

        <div className="command-summary-card">
          <span>Active Alerts</span>
          <strong>{summary.activeAlerts ?? 0}</strong>
        </div>

        <div className="command-summary-card">
          <span>Escalating</span>
          <strong>{summary.escalatingCases ?? 0}</strong>
        </div>

        <div className="command-summary-card">
          <span>Overdue Check-ins</span>
          <strong>{summary.overdueCheckIns ?? 0}</strong>
        </div>
      </section>

      <section className="command-alerts-section">
        <div className="command-section-header">
          <div>
            <span className="metric-label">ALERT MANAGEMENT</span>
            <h2>Active Alerts</h2>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div className="command-alert-empty">
            <h3>No active alerts</h3>
            <p>
              There are currently no active risk alerts requiring attention.
            </p>
          </div>
        ) : (
          <div className="command-alert-list">
            {alerts.map((alert) => (
              <article
                className={`command-alert-card ${alert.severity.toLowerCase()}`}
                key={alert._id}
              >
                <div className="command-alert-main">
                  <div>
                    <span className="alert-type">
                      {alert.type}
                    </span>

                    <h3>
                      {alert.caseId?.name || "Unknown Case"}
                    </h3>

                    <p>
                      {alert.caseId?.email || ""}
                    </p>
                  </div>

                  <span className="alert-severity">
                    {alert.severity}
                  </span>
                </div>

                <div className="command-alert-reasons">
                  <strong>Reason</strong>

                  {alert.reasons?.map((reason, index) => (
                    <p key={index}>{reason}</p>
                  ))}
                </div>

                <div className="command-alert-footer">
                <div>
                  <span>
                    Status: {alert.status}
                  </span>

                  <span>
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="command-alert-actions">
                  {alert.status === 'Active' && (
                    <button
                      type="button"
                      onClick={() =>
                        updateAlert(alert._id, 'acknowledge')
                      }
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.status === 'Acknowledged' && (
                    <button
                      type="button"
                      onClick={() =>
                        updateAlert(alert._id, 'review')
                      }
                    >
                      Start Review
                    </button>
                  )}

                  {alert.status === 'Under Review' && (
                    <button
                      type="button"
                      onClick={() => {
                        const actionNote = window.prompt(
                          'Enter the human action taken:'
                        )

                        if (actionNote !== null) {
                          updateAlert(
                            alert._id,
                            'resolve',
                            actionNote
                          )
                        }
                      }}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="command-interventions-section">
        <div className="command-section-header">
          <div>
            <span className="metric-label">INTERVENTION MANAGEMENT</span>
            <h2>Case Interventions</h2>
          </div>
        </div>

        {interventions.length === 0 ? (
          <div className="command-empty-state">
            <h3>No interventions</h3>
            <p>
              There are currently no interventions assigned to cases.
            </p>
          </div>
        ) : (
          <div className="command-intervention-list">
            {interventions.map((intervention) => (
              <article
                className="command-intervention-card"
                key={intervention._id}
              >
                <div className="command-intervention-main">
                  <div>
                    <span className="intervention-type">
                      {intervention.type}
                    </span>

                    <h3>
                      {intervention.caseId?.name || "Unknown Case"}
                    </h3>

                    <p>
                      {intervention.title}
                    </p>
                  </div>

                  <div className="intervention-badges">
                    <span className="intervention-priority">
                      {intervention.priority}
                    </span>

                    <span className="intervention-status">
                      {intervention.status}
                    </span>
                  </div>
                </div>

                {intervention.description && (
                  <p className="command-intervention-description">
                    {intervention.description}
                  </p>
                )}

                <div className="command-intervention-footer">
                  <span>
                    Assigned to:{" "}
                    {intervention.assignedTo?.name || "Unassigned"}
                  </span>

                  <span>
                    {new Date(intervention.createdAt).toLocaleString()}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="command-risk-overview">
        <div className="command-section-header">
          <div>
            <span className="metric-label">RISK OVERVIEW</span>
            <h2>Current case distribution</h2>
          </div>
        </div>

        <div className="risk-distribution">
          <div>
            <span>Low</span>
            <strong>{summary.lowRisk ?? 0}</strong>
          </div>

          <div>
            <span>Moderate</span>
            <strong>{summary.moderateRisk ?? 0}</strong>
          </div>

          <div>
            <span>High</span>
            <strong>{summary.highRisk ?? 0}</strong>
          </div>

          <div>
            <span>Critical</span>
            <strong>{summary.criticalRisk ?? 0}</strong>
          </div>

          <div>
            <span>No Data</span>
            <strong>{summary.noData ?? 0}</strong>
          </div>
        </div>
      </section>

      <section className="command-cases-section">
        <div className="command-section-header">
          <div>
            <span className="metric-label">CASE LIST</span>
            <h2>Cases requiring attention</h2>
          </div>
        </div>

        {cases.length === 0 ? (
          <div className="command-empty-state">
            <h3>No cases available</h3>
            <p>
              There are currently no victim cases available
              for this authorized workspace.
            </p>
          </div>
        ) : (
          <div className="command-case-list">
            {cases.map((caseItem) => (
              <article
                className="command-case-card"
                key={caseItem.caseId}
                onClick={() =>
                  navigate(`/command-center/${caseItem.caseId}`)
                }
              >
                <div className="case-main">
                  <div>
                    <h3>{caseItem.name}</h3>
                    <p>{caseItem.email}</p>
                  </div>

                  <div className="case-badges">
                    <span
                      className={`case-risk-badge ${caseItem.riskLevel
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                    >
                      {caseItem.riskLevel}
                    </span>

                    <span className={`case-priority ${caseItem.priority?.toLowerCase()}`}>
                      {caseItem.priority || 'Low'} Priority
                    </span>
                  </div>
                </div>

                <div className="case-metrics">
                  <div>
                    <span>Distress</span>
                    <strong>
                      {caseItem.latestDistressScore ?? '—'}
                    </strong>
                  </div>

                  <div>
                    <span>Escalation</span>
                    <strong>
                      {caseItem.escalation?.status || '—'}
                    </strong>
                  </div>

                  <div>
                    <span>Engagement</span>
                    <strong>
                      {caseItem.engagement?.status || '—'}
                    </strong>
                  </div>

                  <div>
                    <span>Check-in</span>
                    <strong>
                      {caseItem.checkInStatus?.status || '—'}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default CommandCenter