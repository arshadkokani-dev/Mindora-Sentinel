import { useEffect, useMemo, useState } from 'react'
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
        </main>
        </div>
        )
        }

        export default Analytics