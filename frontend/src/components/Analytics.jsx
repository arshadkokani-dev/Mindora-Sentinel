import { useEffect, useMemo, useState } from 'react'
import '../styles/analytics.css'
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

function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [analyticsError, setAnalyticsError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch(
          'http://localhost:5000/api/analytics',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        console.log('Analytics:', data)

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to fetch analytics'
          )
        }

        setAnalytics(data)
      } catch (error) {
        console.error('Analytics error:', error)
        setAnalyticsError(error.message)
      } finally {
        setAnalyticsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const trends = analytics?.trends || []

  const emotionData = useMemo(() => {
    if (!analytics?.emotionCounts) {
      return []
    }

    return Object.entries(analytics.emotionCounts).map(
      ([emotion, count]) => ({
        emotion,
        count,
      })
    )
  }, [analytics])

  const emotionColors = [
    '#6366f1',
    '#ef4444',
    '#22c55e',
    '#f59e0b',
    '#8b5cf6',
    '#06b6d4',
  ]

  const formatDate = (date) =>
    new Date(date).toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
    })

  const formatFullDate = (date) =>
    new Date(date).toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  if (analyticsLoading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">
              WELLNESS ANALYTICS
            </p>

            <h1>Your Analytics</h1>

            <p className="dashboard-subtitle">
              Understand how your wellness patterns are changing
              over time.
            </p>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="analytics-section">
            <p>Loading your wellness analytics...</p>
          </section>
        </main>
      </div>
    )
  }

  if (analyticsError) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">
              WELLNESS ANALYTICS
            </p>

            <h1>Your Analytics</h1>

            <p className="dashboard-subtitle">
              Understand how your wellness patterns are changing
              over time.
            </p>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="analytics-section">
            <div className="analytics-header">
              <p className="card-label">
                ANALYTICS UNAVAILABLE
              </p>

              <h2>We couldn't load your analytics</h2>

              <p>{analyticsError}</p>
            </div>
          </section>
        </main>
      </div>
    )
  }

  if (!analytics || trends.length === 0) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">
              WELLNESS ANALYTICS
            </p>

            <h1>Your Analytics</h1>

            <p className="dashboard-subtitle">
              Understand how your wellness patterns are changing
              over time.
            </p>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="analytics-section">
            <div className="analytics-header">
              <p className="card-label">NO DATA YET</p>

              <h2>Your analytics will appear here</h2>

              <p>
                Complete a few wellness check-ins to start seeing
                trends, patterns, and changes over time.
              </p>
            </div>
          </section>
        </main>
      </div>
    )
  }

  const latestTrend = trends[trends.length - 1]

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-label">
            WELLNESS ANALYTICS
          </p>

          <h1>Your Analytics</h1>

          <p className="dashboard-subtitle">
            Understand how your wellness patterns are changing
            over time.
          </p>
        </div>
      </header>

      <main className="dashboard-content">

        {/* ANALYTICS OVERVIEW */}

        <section className="analytics-summary">
          <div className="analytics-summary-header">
            <p className="card-label">ANALYTICS OVERVIEW</p>

            <h2>Your recent wellness picture</h2>

            <p>
              A concise view of your latest signals and longer-term
              patterns.
            </p>
          </div>

          <div className="summary-cards">

            {latestTrend?.distressScore !== undefined && (
              <div className="summary-card">
                <span>Current Distress</span>

                <strong>
                  {latestTrend.distressScore}/100
                </strong>
              </div>
            )}

            {analytics.distressTrend && (
              <div className="summary-card">
                <span>Distress Trend</span>

                <strong>
                  {analytics.distressTrend.trend}
                </strong>
              </div>
            )}

            {analytics.averages?.mood !== undefined && (
              <div className="summary-card">
                <span>Average Mood</span>

                <strong>
                  {analytics.averages.mood.toFixed(1)}/10
                </strong>
              </div>
            )}

            {analytics.averages?.stress !== undefined && (
              <div className="summary-card">
                <span>Average Stress</span>

                <strong>
                  {analytics.averages.stress.toFixed(1)}/10
                </strong>
              </div>
            )}

          </div>
        </section>


        {/* MOOD AND STRESS */}

        <section className="analytics-section">
          <div className="analytics-header">
            <p className="card-label">WELLNESS TRENDS</p>

            <h2>Mood & Stress</h2>

            <p>
              See how mood and stress have changed across your
              check-ins.
            </p>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={trends}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                />

                <YAxis domain={[0, 10]} />

                <Tooltip
                  labelFormatter={formatFullDate}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="mood"
                  name="Mood"
                  stroke="#4f46e5"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="stress"
                  name="Stress"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>


        {/* ENERGY AND SLEEP */}

        <section className="analytics-section secondary-analytics">
          <div className="analytics-header">
            <p className="card-label">ENERGY & SLEEP</p>

            <h2>Energy and sleep</h2>

            <p>
              See how your energy and sleep patterns have changed
              over time.
            </p>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={trends}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                />

                <YAxis domain={[0, 10]} />

                <Tooltip
                  labelFormatter={formatFullDate}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="energy"
                  name="Energy"
                  stroke="#10b981"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="sleep"
                  name="Sleep"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>


        {/* EMOTION PATTERNS */}

        {emotionData.length > 0 && (
          <section className="analytics-section">
            <div className="analytics-header">
              <p className="card-label">EMOTION PATTERNS</p>

              <h2>Your emotions</h2>

              <p>
                See which emotions have appeared most often in
                your recorded check-ins.
              </p>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={emotionData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="emotion" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    name="Times experienced"
                    radius={[6, 6, 0, 0]}
                  >
                    {emotionData.map((entry, index) => (
                      <Cell
                        key={entry.emotion}
                        fill={
                          emotionColors[
                            index % emotionColors.length
                          ]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
        {/* DISTRESS TREND */}

<section className="analytics-section">

  <div className="analytics-header">

    <p className="card-label">
      DISTRESS TREND
    </p>

    <h2>
      Distress over time
    </h2>

    <p>
      Track how your distress score has changed across recent check-ins.
    </p>

  </div>

  {analytics?.distressTrend && (

    <div className="distress-trend-summary">

      <div>
        <span className="metric-label">
          Current trend
        </span>

        <strong>
          {analytics.distressTrend.trend}
        </strong>
      </div>

      <div>
        <span className="metric-label">
          Change
        </span>

        <strong>
          {analytics.distressTrend.change > 0 ? "+" : ""}
          {analytics.distressTrend.change} points
        </strong>
      </div>

    </div>

  )}

  {analytics?.trends?.filter(
    (entry) => entry.distressScore !== undefined
  ).length > 0 ? (

    <div className="chart-container">

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart
          data={analytics.trends.filter(
            (entry) => entry.distressScore !== undefined
          )}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 20,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString([], {
                day: "numeric",
                month: "short",
              })
            }
          />

          <YAxis
            domain={[0, 100]}
          />

          <Tooltip
            labelFormatter={(date) =>
              new Date(date).toLocaleDateString()
            }
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="distressScore"
            name="Distress Score"
            stroke="#dc2626"
            strokeWidth={2}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  ) : (

    <p>
      Complete more check-ins to see your distress trend.
    </p>

  )}

</section>

{/* ESCALATION / EARLY WARNING */}

{analytics?.escalation && (
  <section className="risk-intelligence-section">

    <div className="risk-intelligence-header">
      <div>

        <p className="card-label">
          EARLY WARNING
        </p>

        <h2>
          Recent distress pattern
        </h2>

        <p>
          Longitudinal analysis of recent check-ins to identify
          meaningful changes in distress.
        </p>

      </div>
    </div>


    <div className="early-warning-panel">

      <div className="early-warning-header">

        <div>

          <span className="early-warning-label">
            CURRENT PATTERN
          </span>

          <h3>
            {analytics.escalation.status}
          </h3>

        </div>


        <span
          className={`risk-severity-badge ${
            analytics.escalation.severity?.toLowerCase()
          }`}
        >
          {analytics.escalation.severity}
        </span>

      </div>


      <div className="early-warning-stats">

        <div>

          <span>
            Recent Change
          </span>

          <strong>
            {analytics.escalation.scoreChange > 0
              ? "+"
              : ""}
            {analytics.escalation.scoreChange}
          </strong>

        </div>


        <div>

          <span>
            Elevated Check-ins
          </span>

          <strong>
            {analytics.escalation.highRiskCount}
          </strong>

        </div>


        <div>

          <span>
            Pattern
          </span>

          <strong>
            {analytics.escalation.consecutiveIncrease
              ? "Increasing"
              : "Monitoring"}
          </strong>

        </div>

      </div>


      {analytics.escalation.reasons?.length > 0 && (
        <div className="early-warning-reasons">

          <h4>
            What the pattern shows
          </h4>

          <ul>

            {analytics.escalation.reasons.map(
              (reason, index) => (
                <li key={index}>
                  {reason}
                </li>
              )
            )}

          </ul>

        </div>
      )}

    </div>

  </section>
)}

{/* RISK REASONING */}

{analytics?.riskReasoning?.factors?.length > 0 && (
  <section className="risk-intelligence-section">

    <div className="risk-reasoning-panel">

      <div className="risk-reasoning-header">

        <span>
          RISK REASONING
        </span>

        <h3>
          Contributing factors
        </h3>

      </div>


      <div className="risk-factors">

        {analytics.riskReasoning.factors.map(
          (factor, index) => (

            <div
              className="risk-factor"
              key={index}
            >

              <div className="risk-factor-top">

                <div>

                  <strong>
                    {factor.factor}
                  </strong>

                  <span>
                    {factor.explanation}
                  </span>

                </div>


                <strong>
                  {factor.value}/10
                </strong>

              </div>


              <div className="risk-factor-bar">

                <div
                  className={`risk-factor-fill ${
                    factor.impact?.toLowerCase()
                  }`}
                  style={{
                    width: `${factor.value * 10}%`,
                  }}
                />

              </div>

            </div>

          )
        )}

      </div>

    </div>

  </section>
)}

{/* INTERVENTION RECOMMENDATION */}

{analytics?.intervention?.recommendations?.length > 0 && (
  <section className="risk-intelligence-section">

    <div className="intervention-panel">

      <div className="intervention-header">

        <div>

          <span className="card-label">
            SUPPORT RECOMMENDATION
          </span>

          <h2>
            Recommended next steps
          </h2>

          <p>
            Support actions based on the current distress level
            and recent pattern.
          </p>

        </div>

        <span className="risk-severity-badge">
          {analytics.intervention.priority}
        </span>

      </div>


      <div className="intervention-content">

        {analytics.intervention.recommendations.map(
          (recommendation, index) => (

            <div
              className="intervention-recommendation"
              key={index}
            >

              <span className="metric-label">
                {recommendation.type}
              </span>

              <h3>
                {recommendation.title}
              </h3>

              <p>
                {recommendation.action}
              </p>

              <div className="intervention-reason">

                <strong>
                  Why this is recommended
                </strong>

                <span>
                  {recommendation.reason}
                </span>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  </section>
)}

{/* ENGAGEMENT MONITORING */}

{analytics?.engagement && (
  <section className="analytics-section engagement-section">

    <div className="analytics-header">

      <p className="card-label">
        ENGAGEMENT MONITORING
      </p>

      <h2>
        Check-in engagement
      </h2>

      <p>
        A simple view of recent wellness and journal activity.
      </p>

    </div>


    <div className="summary-cards">

      <div className="summary-card">
        <span>Activity Status</span>

        <strong>
          {analytics.engagement.status}
        </strong>
      </div>


      <div className="summary-card">
        <span>Engagement Trend</span>

        <strong>
          {analytics.engagement.trend}
        </strong>
      </div>


      <div className="summary-card">
        <span>Wellness Check-ins</span>

        <strong>
          {analytics.engagement.totalCheckIns}
        </strong>
      </div>


      <div className="summary-card">
        <span>Journal Entries</span>

        <strong>
          {analytics.engagement.totalJournalEntries}
        </strong>
      </div>

    </div>


    <div className="engagement-details">

      <div>
        <span className="metric-label">
          LAST INTERACTION
        </span>

        <strong>
          {analytics.engagement.lastInteraction
            ? formatFullDate(
                analytics.engagement.lastInteraction
              )
            : "No interaction recorded"}
        </strong>
      </div>


      <div>
        <span className="metric-label">
          DAYS SINCE LAST INTERACTION
        </span>

        <strong>
          {analytics.engagement.daysSinceLastInteraction ?? "—"}
        </strong>
      </div>

    </div>

  </section>
)}

{/* PERIODIC CHECK-IN */}

{analytics?.checkInStatus && (
  <section className="analytics-section checkin-status-section">

    <div className="analytics-header">

      <p className="card-label">
        PERIODIC CHECK-IN
      </p>

      <h2>
        Check-in schedule
      </h2>

      <p>
        Stay connected through regular wellness check-ins.
      </p>

    </div>


    <div className="checkin-status-panel">

      <div className="checkin-status-main">

        <span className="metric-label">
          CURRENT STATUS
        </span>

        <strong>
          {analytics.checkInStatus.status}
        </strong>

      </div>


      <div className="checkin-status-details">

        <div>
          <span className="metric-label">
            CHECK-IN INTERVAL
          </span>

          <strong>
            Every {analytics.checkInStatus.intervalDays} days
          </strong>
        </div>


        <div>
          <span className="metric-label">
            LAST CHECK-IN
          </span>

          <strong>
            {analytics.checkInStatus.lastCheckIn
              ? formatFullDate(
                  analytics.checkInStatus.lastCheckIn
                )
              : "Not available"}
          </strong>
        </div>


        <div>
          <span className="metric-label">
            NEXT CHECK-IN
          </span>

          <strong>
            {analytics.checkInStatus.nextCheckInDue
              ? formatFullDate(
                  analytics.checkInStatus.nextCheckInDue
                )
              : "Not scheduled"}
          </strong>
        </div>

      </div>


      {analytics.checkInStatus.status === "Scheduled" && (
        <p className="checkin-status-message">
          Your next wellness check-in is scheduled in{" "}
          <strong>
            {analytics.checkInStatus.daysUntilDue}{" "}
            {analytics.checkInStatus.daysUntilDue === 1
              ? "day"
              : "days"}
          </strong>.
        </p>
      )}


      {analytics.checkInStatus.status === "Overdue" && (
        <p className="checkin-status-message overdue">
          Your scheduled check-in is{" "}
          <strong>
            {analytics.checkInStatus.daysOverdue}{" "}
            {analytics.checkInStatus.daysOverdue === 1
              ? "day"
              : "days"}{" "}
            overdue
          </strong>.
        </p>
      )}

    </div>

  </section>
)}

{/* EMOTIONAL TRAJECTORY */}

{analytics?.emotionalTrajectory && (
  <section className="analytics-section">

    <div className="analytics-header">

      <p className="card-label">
        EMOTIONAL TRAJECTORY
      </p>

      <h2>
        Emotional changes over time
      </h2>

      <p>
        Changes in emotional signals across recent journal
        entries and check-ins.
      </p>

    </div>


    <div className="emotional-trajectory-panel">

      <div className="trajectory-status">

        <span className="metric-label">
          OVERALL TREND
        </span>

        <strong>
          {analytics.emotionalTrajectory.overall ||
            analytics.emotionalTrajectory.trend ||
            "Stable"}
        </strong>

      </div>


      {(analytics.emotionalTrajectory.summary ||
        analytics.emotionalTrajectory.overallSummary) && (

        <div className="trajectory-summary">

          <span className="metric-label">
            SUMMARY
          </span>

          <p>
            {analytics.emotionalTrajectory.summary ||
              analytics.emotionalTrajectory.overallSummary}
          </p>

        </div>

      )}


      {analytics.emotionalTrajectory.changes?.length > 0 && (

        <div className="trajectory-section">

          <h3>
            Changes detected
          </h3>

          <div className="trajectory-list">

            {analytics.emotionalTrajectory.changes.map(
              (change, index) => (

                <div
                  className="trajectory-item"
                  key={index}
                >

                  <strong>
                    {change.type ||
                      change.change ||
                      "Change detected"}
                  </strong>

                  <span>
                    {change.description ||
                      change.detail ||
                      change.value ||
                      ""}
                  </span>

                </div>

              )
            )}

          </div>

        </div>

      )}


      {analytics.emotionalTrajectory.persistentSignals?.length > 0 && (

        <div className="trajectory-section">

          <h3>
            Persistent signals
          </h3>

          <ul>

            {analytics.emotionalTrajectory.persistentSignals.map(
              (signal, index) => (
                <li key={index}>
                  {typeof signal === "string"
                    ? signal
                    : signal.signal || signal.name}
                </li>
              )
            )}

          </ul>

        </div>

      )}


      {analytics.emotionalTrajectory.emergingSignals?.length > 0 && (

        <div className="trajectory-section">

          <h3>
            Emerging signals
          </h3>

          <ul>

            {analytics.emotionalTrajectory.emergingSignals.map(
              (signal, index) => (
                <li key={index}>
                  {typeof signal === "string"
                    ? signal
                    : signal.signal || signal.name}
                </li>
              )
            )}

          </ul>

        </div>

      )}

    </div>

  </section>
)}

{/* AI CONTEXTUAL SUMMARY */}

{analytics?.aiSummary && (
  <section className="analytics-section">

    <div className="analytics-header">

      <p className="card-label">
        AI CONTEXT
      </p>

      <h2>
        Longitudinal summary
      </h2>

      <p>
        A concise summary of meaningful patterns identified
        across the available wellness data.
      </p>

    </div>


    <div className="ai-summary-panel">

      <p>
        {typeof analytics.aiSummary === "string"
          ? analytics.aiSummary
          : analytics.aiSummary.summary ||
            analytics.aiSummary.text ||
            "No contextual summary is available yet."}
      </p>

    </div>

  </section>
)}

        </main>
        </div>
        )
        }

        export default Analytics