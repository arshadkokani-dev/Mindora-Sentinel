import { useEffect, useState } from 'react'
import '../styles/commandCenter.css'
import { useNavigate } from 'react-router-dom'

function CommandCenter() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [interventionStatusFilter, setInterventionStatusFilter] = useState('All')
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [caseStatusFilter, setCaseStatusFilter] = useState('All')

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

const updateCaseStatus = async (caseId, status) => {
  try {
    const token = localStorage.getItem('token')

    const response = await fetch(
      `http://localhost:5000/api/case-lifecycle/${caseId}/status`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message || 'Failed to update case status'
      )
    }

    setData((currentData) => ({
      ...currentData,
      cases: currentData.cases.map((caseItem) =>
        caseItem.caseId === caseId
          ? {
              ...caseItem,
              caseStatus: result.case.caseStatus,
            }
          : caseItem
      ),
    }))
  } catch (error) {
    console.error('Case status update error:', error)
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
            {alerts
              .filter((alert) => alert.status !== 'Resolved')
              .map((alert) => (
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
          <>
          <div className="case-filter-control">
            <label htmlFor="intervention-status-filter">
              Filter by Status
            </label>

            <select
              id="intervention-status-filter"
              value={interventionStatusFilter}
              onChange={(event) =>
                setInterventionStatusFilter(event.target.value)
              }
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="command-intervention-list">
            {interventions
              .filter(
                (intervention) =>
                  interventionStatusFilter === 'All' ||
                  intervention.status === interventionStatusFilter
              )
              .map((intervention) => (
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
          </>
        )}
      </section>

      <section className="command-risk-overview">
        <div className="command-section-header">
          <div>
            <span className="metric-label">RISK OVERVIEW</span>
            <h2>Current case distribution</h2>
          </div>
        </div>

        {(() => {
          const low = summary.lowRisk ?? 0
          const moderate = summary.moderateRisk ?? 0
          const high = summary.highRisk ?? 0
          const critical = summary.criticalRisk ?? 0
          const noData = summary.noData ?? 0

          const total = low + moderate + high + critical + noData

          const percentage = (value) =>
            total > 0 ? Math.round((value / total) * 100) : 0

          return (
            <div className="risk-distribution">
              <div>
                <span>Low</span>
                <strong>{low}</strong>
                <small>{percentage(low)}%</small>
              </div>

              <div>
                <span>Moderate</span>
                <strong>{moderate}</strong>
                <small>{percentage(moderate)}%</small>
              </div>

              <div>
                <span>High</span>
                <strong>{high}</strong>
                <small>{percentage(high)}%</small>
              </div>

              <div>
                <span>Critical</span>
                <strong>{critical}</strong>
                <small>{percentage(critical)}%</small>
              </div>

              <div>
                <span>No Data</span>
                <strong>{noData}</strong>
                <small>{percentage(noData)}%</small>
              </div>
            </div>
          )
        })()}
      </section>

      <section className="command-hierarchy">
        <div className="command-section-header">
          <div>
            <span className="metric-label">
              ADMINISTRATIVE HIERARCHY
            </span>
            <h2>National → State → District</h2>
          </div>
        </div>

        <div className="hierarchy-national">
          <div>
            <strong>
              {data?.hierarchy?.national?.totalCases ?? 0}
            </strong>
            <span>Cases across India</span>
          </div>

          <div className="hierarchy-risk-summary">
            <span>
              High/Critical{" "}
              {(data?.hierarchy?.national?.highRisk ?? 0) +
                (data?.hierarchy?.national?.criticalRisk ?? 0)}
            </span>

            <span>
              Alerts {data?.hierarchy?.national?.activeAlerts ?? 0}
            </span>

            <span>
              Escalating{" "}
              {data?.hierarchy?.national?.escalatingCases ?? 0}
            </span>
          </div>
        </div>

        <div className="hierarchy-states">
          {Object.values(data?.hierarchy?.states || {}).map(
            (stateItem) => (
              <div
                className="hierarchy-state"
                key={stateItem.state}
              >
                <div className="hierarchy-state-header">
                  <strong>{stateItem.state}</strong>
                  <span>
                    {stateItem.totalCases} cases
                  </span>
                </div>

                <div className="hierarchy-state-metrics">
                  <span>
                    High/Critical{" "}
                    {(stateItem.highRisk ?? 0) +
                      (stateItem.criticalRisk ?? 0)}
                  </span>

                  <span>
                    Alerts {stateItem.activeAlerts ?? 0}
                  </span>

                  <span>
                    Escalating{" "}
                    {stateItem.escalatingCases ?? 0}
                  </span>
                </div>

                <div className="hierarchy-districts">
                  {Object.values(
                    stateItem.districts || {}
                  ).map((districtItem) => (
                    <div
                      className="hierarchy-district"
                      key={`${stateItem.state}-${districtItem.district}`}
                    >
                      <span>{districtItem.district}</span>

                      <div>
                        <span>
                          {districtItem.totalCases} cases
                        </span>

                        <span>
                          High/Critical{" "}
                          {(districtItem.highRisk ?? 0) +
                            (districtItem.criticalRisk ?? 0)}
                        </span>

                        <span>
                          Alerts{" "}
                          {districtItem.activeAlerts ?? 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
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
          <>
          <div className="case-filter-control">
            <label htmlFor="case-status-filter">Filter by Status</label>

            <select
              id="case-status-filter"
              value={caseStatusFilter}
              onChange={(event) => setCaseStatusFilter(event.target.value)}
            >
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="Under Review">Under Review</option>
              <option value="Active Support">Active Support</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="command-case-list">
            {cases
              .filter(
                (caseItem) =>
                  caseStatusFilter === 'All' ||
                  (caseItem.caseStatus || 'Open') === caseStatusFilter
              )
              .map((caseItem) => (
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

                <div className="case-predictive-risk">
                  <div className="case-predictive-header">
                    <span>Predictive Risk</span>

                    <strong
                    className={`predictive-risk-value ${
                      caseItem.predictiveRisk?.predictedRiskLevel
                        ?.toLowerCase()
                        .replace(/\s+/g, '-') || 'insufficient'
                    }`}
                  >
                    {caseItem.predictiveRisk?.predictedRiskLevel ||
                      "Insufficient Data"}
                  </strong>
                  </div>

                  <div className="case-predictive-details">
                    <span>
                      Projected Score:{" "}
                      {caseItem.predictiveRisk?.projectedScore ?? "—"}
                    </span>

                    <span>
                      Trend:{" "}
                      {caseItem.predictiveRisk?.trend || "Unknown"}
                    </span>

                    <span>
                      Confidence:{" "}
                      {caseItem.predictiveRisk?.confidence || "Low"}
                    </span>
                  </div>

                  {caseItem.predictiveRisk?.reasons?.length > 0 && (
                    <p>
                      {caseItem.predictiveRisk.reasons[0]}
                    </p>
                  )}
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

                  <div>
                  <span>Case Status</span>
                  <strong>
                    {caseItem.caseStatus || 'Open'}
                  </strong>

                  <div className="case-status-control">
                  <label htmlFor={`case-status-${caseItem.caseId}`}>
                    Case Status
                  </label>

                  <select
                    id={`case-status-${caseItem.caseId}`}
                    value={caseItem.caseStatus || 'Open'}
                    onChange={(event) =>
                      updateCaseStatus(
                        caseItem.caseId,
                        event.target.value
                      )
                    }
                    onClick={(event) => event.stopPropagation()}
                  >
                    <option value="Open">Open</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Active Support">Active Support</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                </div>

                </div>
              </article>
            ))}
          </div>
          </>)}
      </section>
    </div>
  )
}

export default CommandCenter