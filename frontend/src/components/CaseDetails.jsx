import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../styles/caseDetails.css'

function CaseDetails() {
  const { caseId } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch(
          `http://localhost:5000/api/cases/${caseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.message || 'Failed to load case details'
          )
        }

        setData(result)
      } catch (error) {
        console.error('Case Details error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCaseDetails()
  }, [caseId])

  if (loading) {
    return (
      <main className="case-details-page">
        <div className="case-details-state">
          <p>Loading case details...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="case-details-page">
        <div className="case-details-state error">
          <h2>Unable to load case</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate('/command-center')}
          >
            Back to Command Center
          </button>
        </div>
      </main>
    )
  }

  const caseData = data?.case || {}
  const timeline = data?.timeline || []
  const auditLogs = data?.auditLogs || []

  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const riskClass =
    caseData.riskLevel
      ?.toLowerCase()
      .replace(/\s+/g, '-') || ''

  return (
    <main className="case-details-page">

      <header className="case-details-header">
        <button
          type="button"
          className="case-back-button"
          onClick={() => navigate('/command-center')}
        >
          ← Back to Command Center
        </button>

        <div className="case-details-title">
          <span className="metric-label">
            CASE DETAILS
          </span>

          <h1>{caseData.name || 'Unknown Case'}</h1>

          <p>{caseData.email || 'No email available'}</p>
        </div>

        <span className={`case-details-risk ${riskClass}`}>
          {caseData.riskLevel || 'No Data'}
        </span>
      </header>

      <section className="case-overview-grid">

        <div className="case-overview-card">
          <span>Distress Score</span>
          <strong>
            {caseData.latestDistressScore ?? '—'}
          </strong>
        </div>

        <div className="case-overview-card">
          <span>Escalation</span>
          <strong>
            {caseData.escalation?.status || '—'}
          </strong>
        </div>

        <div className="case-overview-card">
          <span>Engagement</span>
          <strong>
            {caseData.engagement?.status || '—'}
          </strong>
        </div>

        <div className="case-overview-card">
          <span>Check-in</span>
          <strong>
            {caseData.checkInStatus?.status || '—'}
          </strong>
        </div>

      </section>

      <section className="case-details-section">

        <div className="case-section-header">
          <span className="metric-label">
            RISK INTELLIGENCE
          </span>

          <h2>Current case assessment</h2>
        </div>

        <div className="case-intelligence-grid">

          <div className="case-info-card">
            <span className="metric-label">
              ESCALATION
            </span>

            <h3>
              {caseData.escalation?.status || '—'}
            </h3>

            <p>
              Severity:{' '}
              {caseData.escalation?.severity || '—'}
            </p>

            <p>
              Score change:{' '}
              {caseData.escalation?.scoreChange ?? 0}
            </p>

            <p>
              High-risk check-ins:{' '}
              {caseData.escalation?.highRiskCount ?? 0}
            </p>
          </div>

          <div className="case-info-card">
            <span className="metric-label">
              ALERT STATUS
            </span>

            <h3>
              {caseData.riskAlert?.alert
                ? 'Active Alert'
                : 'No Active Alert'}
            </h3>

            <p>
              Type:{' '}
              {caseData.riskAlert?.type || 'None'}
            </p>

            <p>
              Severity:{' '}
              {caseData.riskAlert?.severity || '—'}
            </p>
          </div>

          <div className="case-info-card">
            <span className="metric-label">
              ENGAGEMENT
            </span>

            <h3>
              {caseData.engagement?.status || '—'}
            </h3>

            <p>
              Trend:{' '}
              {caseData.engagement?.trend || '—'}
            </p>

            <p>
              Total check-ins:{' '}
              {caseData.engagement?.totalCheckIns ?? 0}
            </p>

            <p>
              Journal entries:{' '}
              {caseData.engagement?.totalJournalEntries ?? 0}
            </p>
          </div>

          <div className="case-info-card">
            <span className="metric-label">
              CHECK-IN STATUS
            </span>

            <h3>
              {caseData.checkInStatus?.status || '—'}
            </h3>

            <p>
              Last check-in:{' '}
              {formatDate(
                caseData.checkInStatus?.lastCheckIn
              )}
            </p>

            <p>
              Next due:{' '}
              {formatDate(
                caseData.checkInStatus?.nextCheckInDue
              )}
            </p>

            <p>
              Days overdue:{' '}
              {caseData.checkInStatus?.daysOverdue ?? 0}
            </p>
          </div>

        </div>
      </section>

      <section className="case-details-section">

        <div className="case-section-header">
          <span className="metric-label">
            EXPLAINABLE RISK
          </span>

          <h2>Why this case needs attention</h2>
        </div>

        <div className="case-reasoning-card">

          {caseData.escalation?.reasons?.length > 0 ? (
            <ul>
              {caseData.escalation.reasons.map(
                (reason, index) => (
                  <li key={index}>{reason}</li>
                )
              )}
            </ul>
          ) : caseData.riskAlert?.reasons?.length > 0 ? (
            <ul>
              {caseData.riskAlert.reasons.map(
                (reason, index) => (
                  <li key={index}>{reason}</li>
                )
              )}
            </ul>
          ) : (
            <p>
              No significant risk reasoning is currently
              available.
            </p>
          )}

        </div>
      </section>

      <section className="case-details-section">

        <div className="case-section-header">
          <span className="metric-label">
            SUPPORT RECOMMENDATION
          </span>

          <h2>Recommended human follow-up</h2>
        </div>

        <div className="case-intervention-list">

          {caseData.intervention?.recommendations
            ?.length > 0 ? (
            caseData.intervention.recommendations.map(
              (recommendation, index) => (
                <article
                  className="case-intervention-card"
                  key={index}
                >
                  <span className="metric-label">
                    {recommendation.type}
                  </span>

                  <h3>{recommendation.title}</h3>

                  <p>{recommendation.action}</p>

                  <div className="case-intervention-reason">
                    <strong>Reason</strong>
                    <span>
                      {recommendation.reason}
                    </span>
                  </div>
                </article>
              )
            )
          ) : (
            <div className="case-empty-card">
              No support recommendation is currently
              available.
            </div>
          )}

        </div>
      </section>

      <section className="case-details-section">

        <div className="case-section-header">
          <span className="metric-label">
            CASE TIMELINE
          </span>

          <h2>Wellness and risk history</h2>

          <p>
            Longitudinal view of recorded wellness
            check-ins.
          </p>
        </div>

        {timeline.length === 0 ? (
          <div className="case-empty-card">
            No wellness timeline entries available.
          </div>
        ) : (
          <div className="case-timeline">

            {timeline.map((entry) => (
              <article
                className="case-timeline-item"
                key={entry.id}
              >
                <div className="case-timeline-marker" />

                <div className="case-timeline-content">

                  <div className="case-timeline-header">

                    <div>
                      <span className="metric-label">
                        CHECK-IN
                      </span>

                      <h3>
                        {formatDateTime(entry.date)}
                      </h3>
                    </div>

                    <span
                      className={`case-timeline-risk ${
                        entry.riskLevel
                          ?.toLowerCase()
                          .replace(/\s+/g, '-') || ''
                      }`}
                    >
                      {entry.riskLevel || 'No Data'}
                    </span>

                  </div>

                  <div className="case-timeline-metrics">

                    <div>
                      <span>Distress</span>
                      <strong>
                        {entry.distressScore ?? '—'}
                      </strong>
                    </div>

                    <div>
                      <span>Mood</span>
                      <strong>
                        {entry.mood ?? '—'}/10
                      </strong>
                    </div>

                    <div>
                      <span>Stress</span>
                      <strong>
                        {entry.stress ?? '—'}/10
                      </strong>
                    </div>

                    <div>
                      <span>Anxiety</span>
                      <strong>
                        {entry.anxiety ?? '—'}/10
                      </strong>
                    </div>

                    <div>
                      <span>Sleep</span>
                      <strong>
                        {entry.sleep ?? '—'}/10
                      </strong>
                    </div>

                    <div>
                      <span>Energy</span>
                      <strong>
                        {entry.energy ?? '—'}/10
                      </strong>
                    </div>

                  </div>

                  {entry.emotion && (
                    <div className="case-timeline-emotion">
                      <span className="metric-label">
                        EMOTION
                      </span>

                      <p>{entry.emotion}</p>
                    </div>
                  )}

                </div>
              </article>
            ))}

          </div>
        )}

      </section>
      <section className="case-details-section">

      <div className="case-section-header">
        <span className="metric-label">
          AUDIT ACTIVITY
        </span>

        <h2>Case action history</h2>

        <p>
          Recorded actions performed by authorized staff.
        </p>
      </div>

      {auditLogs.length === 0 ? (
        <div className="case-empty-card">
          No audit activity has been recorded for this case.
        </div>
      ) : (
        <div className="case-audit-list">

          {auditLogs.map((log) => (
            <article
              className="case-audit-card"
              key={log.id}
            >
              <div>
                <span className="metric-label">
                  {log.action
                    ?.replace(/_/g, ' ')
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </span>

                <h3>{log.details || 'Case action recorded'}</h3>

                <p>
                  {log.actor?.name || 'Unknown user'} ·{' '}
                  {log.actor?.role || 'Authorized staff'}
                </p>
              </div>

              <time>
                {formatDateTime(log.createdAt)}
              </time>
            </article>
          ))}

        </div>
      )}

    </section>

    </main>
    
  )
}

export default CaseDetails