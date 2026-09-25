import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'


function Dashboard() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Analytics:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch analytics");
      }

      setAnalytics(data);
    } catch (error) {
      console.error("Analytics error:", error);
      setAnalyticsError(error.message);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  fetchAnalytics();
}, []);

useEffect(() => {
  const fetchEntries = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:5000/api/wellness', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      console.log('Wellness entries:', data)

      if (response.ok) {
        setEntries(data.entries)
      }
    } catch (error) {
      console.error('Error fetching wellness entries:', error)
    }
  }

  fetchEntries()
}, [])

const emotionData = analytics?.emotionCounts
  ? Object.entries(analytics.emotionCounts).map(([emotion, count]) => ({
      emotion,
      count,
    }))
  : []

  const latestEntry = entries.length > 0 ? entries[0] : null

  const emotionColors = [
  "#6366f1",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
]

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-label">YOUR WELLNESS SPACE</p>
          <h1>Welcome back</h1>
          <p className="dashboard-subtitle">
            Take a moment to check in with yourself.
          </p>
        </div>
      </header>
    

      <main className="dashboard-content">

<section className="wellbeing-overview">
  <div className="wellbeing-overview-header">
    <div>
      <p className="card-label">YOUR WELLBEING AT A GLANCE</p>
      <h2>Your current wellbeing</h2>
      <p>
        A quick view of your recent wellness check-ins and current distress status.
      </p>
    </div>
  </div>

  {!analyticsLoading &&
    !analyticsError &&
    analytics?.averages && (
      <div className="wellbeing-metrics">
        <div className="wellbeing-metric">
          <span>Mood</span>
          <strong>{analytics.averages.mood.toFixed(1)}</strong>
          <small>/10</small>
        </div>

        <div className="wellbeing-metric">
          <span>Energy</span>
          <strong>{analytics.averages.energy.toFixed(1)}</strong>
          <small>/10</small>
        </div>

        <div className="wellbeing-metric">
          <span>Sleep</span>
          <strong>{analytics.averages.sleep.toFixed(1)}</strong>
          <small>/10</small>
        </div>

        <div className="wellbeing-metric">
          <span>Stress</span>
          <strong>{analytics.averages.stress.toFixed(1)}</strong>
          <small>/10</small>
        </div>

        <div className="wellbeing-metric">
          <span>Anxiety</span>
          <strong>{analytics.averages.anxiety.toFixed(1)}</strong>
          <small>/10</small>
        </div>
      </div>
    )}

  {!analyticsLoading &&
    !analyticsError &&
    analytics &&
    !analytics.averages && (
      <p className="wellbeing-empty">
        Complete your first check-in to see your wellbeing snapshot.
      </p>
    )}

  <div className="wellbeing-status">
    <div className="wellbeing-status-card">
      <span className="wellbeing-status-label">CURRENT DISTRESS</span>

      <div className="wellbeing-status-value">
        {latestEntry?.distressScore ?? '—'}
        {latestEntry?.distressScore !== undefined && <small>/100</small>}
      </div>

      <p>Based on your latest wellness check-in.</p>
    </div>

    <div className="wellbeing-status-card">
      <span className="wellbeing-status-label">CURRENT RISK</span>

      <div className="wellbeing-risk-value">
        {latestEntry?.riskLevel ?? 'No data'}
      </div>

      <p>Your current wellbeing risk level.</p>
    </div>
  </div>
</section>


        {/* Risk Intelligence */}
<section className="risk-intelligence-section">
  <div className="risk-intelligence-header">
    <div>
      <p className="card-label">RISK INTELLIGENCE</p>
      <h2>Early warning & risk assessment</h2>
      <p>
        Recent wellness patterns are analyzed to identify changes
        that may require timely support.
      </p>
    </div>
  </div>

  {/* Risk Alert */}
  {analytics?.riskAlert?.alert && (
    <div className="risk-alert-section">
      <div className="risk-alert-header">
        <div>
          <span className="risk-alert-label">RISK ALERT</span>
          <h3>{analytics.riskAlert.type}</h3>
          <p>
            An actionable risk pattern has been detected from
            recent wellness check-ins.
          </p>
        </div>

        <span
          className={`risk-severity-badge ${analytics.riskAlert.severity.toLowerCase()}`}
        >
          {analytics.riskAlert.severity}
        </span>
      </div>

      <div className="risk-alert-details">
        <div className="risk-alert-item">
          <span>Current Distress</span>
          <strong>
            {latestEntry?.distressScore ?? "—"}
            <small>/100</small>
          </strong>
        </div>

        <div className="risk-alert-item">
          <span>Risk Level</span>
          <strong>
            {latestEntry?.riskLevel ?? "—"}
          </strong>
        </div>

        <div className="risk-alert-item">
          <span>Escalation</span>
          <strong>
            {analytics?.escalation?.status ?? "—"}
          </strong>
        </div>
      </div>

      {analytics.riskAlert.reasons?.length > 0 && (
        <div className="risk-alert-reasons">
          <h4>Why this was flagged</h4>

          <ul>
            {analytics.riskAlert.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="risk-alert-action">
        <span>Recommended next step</span>
        <strong>Human review recommended</strong>
      </div>
    </div>
  )}

  {/* Early Warning */}
  {analytics?.escalation && (
    <div className="early-warning-panel">
      <div className="early-warning-header">
        <div>
          <span className="early-warning-label">EARLY WARNING</span>
          <h3>{analytics.escalation.status}</h3>
        </div>

        <span
          className={`risk-severity-badge ${analytics.escalation.severity.toLowerCase()}`}
        >
          {analytics.escalation.severity}
        </span>
      </div>

      <div className="early-warning-stats">
        <div>
          <span>Recent Change</span>
          <strong>
            {analytics.escalation.scoreChange > 0 ? "+" : ""}
            {analytics.escalation.scoreChange}
          </strong>
        </div>

        <div>
          <span>Elevated Check-ins</span>
          <strong>
            {analytics.escalation.highRiskCount}
          </strong>
        </div>

        <div>
          <span>Pattern</span>
          <strong>
            {analytics.escalation.consecutiveIncrease
              ? "Increasing"
              : "Monitoring"}
          </strong>
        </div>
      </div>

      {analytics.escalation.reasons?.length > 0 && (
        <div className="early-warning-reasons">
          <h4>Pattern detected</h4>

          <ul>
            {analytics.escalation.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )}

  {/* Risk Reasoning */}
  {analytics?.riskReasoning?.factors?.length > 0 && (
    <div className="risk-reasoning-panel">
      <div className="risk-reasoning-header">
        <span>RISK REASONING</span>
        <h3>Contributing factors</h3>
      </div>

      <div className="risk-factors">
        {analytics.riskReasoning.factors.map((factor, index) => (
          <div className="risk-factor" key={index}>
            <div className="risk-factor-top">
              <div>
                <strong>{factor.factor}</strong>
                <span>{factor.explanation}</span>
              </div>

              <strong>
                {factor.value}/10
              </strong>
            </div>

            <div className="risk-factor-bar">
              <div
                className={`risk-factor-fill ${factor.impact.toLowerCase()}`}
                style={{
                  width: `${factor.value * 10}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Intervention Recommendation */}
  {analytics?.intervention?.recommendations?.length > 0 && (
    <div className="intervention-panel">
      <div className="intervention-header">
        <div>
          <span className="intervention-label">
            SUPPORT RECOMMENDATION
          </span>
          <h3>Recommended next steps</h3>
          <p>
            Suggested actions based on the current risk pattern
            and recent check-in history.
          </p>
        </div>

        <span
          className={`intervention-priority ${analytics.intervention.priority.toLowerCase()}`}
        >
          {analytics.intervention.priority} Priority
        </span>
      </div>

      <div className="intervention-list">
        {analytics.intervention.recommendations.map(
          (recommendation, index) => (
            <div className="intervention-card" key={index}>
              <div className="intervention-card-header">
                <div>
                  <span className="intervention-type">
                    {recommendation.type}
                  </span>

                  <h4>{recommendation.title}</h4>
                </div>
              </div>

              <div className="intervention-detail">
                <span>Recommended action</span>
                <p>{recommendation.action}</p>
              </div>

              <div className="intervention-detail">
                <span>Why</span>
                <p>{recommendation.reason}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )}


  <p className="risk-intelligence-note">
    Analysis of recent distress patterns to support timely intervention.
  </p>
</section>

{analytics?.longitudinalEmotion && (
  <section className="dashboard-section emotional-trajectory-section">
    <div className="section-heading">
      <div>
        <h2>Emotional Trajectory</h2>
        <p>
          AI-assisted analysis of how emotional signals are changing
          across recent journal entries.
        </p>
      </div>

      <span
        className={`trajectory-status ${
          analytics.longitudinalEmotion.overallDirection
            ?.toLowerCase()
            .replace(/\s+/g, "-")
        }`}
      >
        {analytics.longitudinalEmotion.overallDirection}
      </span>
    </div>

    <div className="trajectory-summary">
      <h3>{analytics.longitudinalEmotion.status}</h3>

      <p>
        {analytics.longitudinalEmotion.summary}
      </p>
    </div>

    <div className="trajectory-grid">
      <div className="trajectory-card">
        <h4>Changes Detected</h4>

        {analytics.longitudinalEmotion.changes?.length > 0 ? (
          <div className="trajectory-list">
            {analytics.longitudinalEmotion.changes.map(
              (change, index) => (
                <div
                  className="trajectory-item"
                  key={index}
                >
                  <strong>
                    {change.direction} — {change.signal}
                  </strong>

                  <span>
                    {change.explanation}
                  </span>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="trajectory-empty">
            No significant changes detected across recent
            journal entries.
          </p>
        )}
      </div>

      <div className="trajectory-card">
        <h4>Persistent Signals</h4>

        {analytics.longitudinalEmotion.persistentSignals
          ?.length > 0 ? (
          <div className="signal-tags">
            {analytics.longitudinalEmotion.persistentSignals.map(
              (signal, index) => (
                <span
                  className="signal-tag"
                  key={index}
                >
                  {signal}
                </span>
              )
            )}
          </div>
        ) : (
          <p className="trajectory-empty">
            No persistent emotional signals detected.
          </p>
        )}
      </div>

      <div className="trajectory-card">
        <h4>Emerging Signals</h4>

        {analytics.longitudinalEmotion.emergingSignals
          ?.length > 0 ? (
          <div className="signal-tags">
            {analytics.longitudinalEmotion.emergingSignals.map(
              (signal, index) => (
                <span
                  className="signal-tag"
                  key={index}
                >
                  {signal}
                </span>
              )
            )}
          </div>
        ) : (
          <p className="trajectory-empty">
            No new emotional signals detected.
          </p>
        )}
      </div>
    </div>
  </section>
)}

        <section className="checkin-card">
          <div>
            <p className="card-label">TODAY'S CHECK-IN</p>
            <h2>How are you feeling today?</h2>
            <p>
              Track your mood, energy and thoughts in a few minutes.
            </p>
          </div>

          <button className="primary-button" onClick={() => navigate('/checkin')}>
            Start today's check-in
          </button>
        </section>

        <section className="checkin-card cbt-card">
  <div>
    <p className="card-label">DEEPER REFLECTION</p>
    <h2>Want to explore your thoughts more deeply?</h2>
    <p>
      Use our optional CBT-style journal to reflect on situations,
      thoughts, emotions, and alternative perspectives.
    </p>
  </div>

  <button
    className="primary-button"
    onClick={() => navigate('/cbt-journal')}
  >
    Open CBT Journal
  </button>
</section>

        <section className="wellness-section">
  <h2>Your wellness</h2>

  {entries.length === 0 ? (
    <p>No wellness entries yet. Your first check-in will appear here.</p>
  ) : (
    <div className="wellness-entries">
      {entries.map((entry) => (
        <div className="wellness-entry" key={entry._id}>

          <p className="entry-date">
            Date: <strong>{new Date(entry.date).toLocaleDateString()}</strong>
          </p>

          <div className="entry-metrics">
            <p><strong>Mood:</strong> {entry.mood}/10</p>
            <p><strong>Energy:</strong> {entry.energy}/10</p>
            <p><strong>Sleep:</strong> {entry.sleep}/10</p>
            <p><strong>Stress:</strong> {entry.stress}/10</p>
            <p><strong>Anxiety:</strong> {entry.anxiety}/10</p>
            <p><strong>Emotion:</strong> {entry.emotion}</p>
          </div>

          <div className="entry-journal">
            <strong>Journal</strong>
            <p>{entry.journal}</p>
          </div>

        </div>
      ))}
    </div>
  )}
</section>
</main>
</div>
  )
}


export default Dashboard