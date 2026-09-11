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

      <section className="analytics-summary">
  <div className="analytics-summary-header">
    <p className="card-label">DISTRESS STATUS</p>
    <h2>Your current risk level</h2>
    <p>
      Based on your latest wellness check-in.
    </p>
  </div>

  {latestEntry?.distressScore !== undefined ? (
    <div className="summary-cards">

      <div className="summary-card">
        <span>Distress Score</span>
        <strong>{latestEntry.distressScore}/100</strong>
      </div>

      <div className="summary-card">
        <span>Risk Level</span>
        <strong>{latestEntry.riskLevel}</strong>
      </div>

    </div>
  ) : (
    <p>
      Complete a new check-in to see your current distress status.
    </p>
  )}
</section>
        
        <section className="analytics-summary">
  <div className="analytics-summary-header">
    <p className="card-label">YOUR WELLNESS SNAPSHOT</p>
    <h2>How you've been feeling</h2>
    <p>Your average scores across your recent check-ins.</p>
  </div>

  {!analyticsLoading &&
    !analyticsError &&
    analytics?.averages && (
      <div className="summary-cards">

        <div className="summary-card">
          <span>Mood</span>
          <strong>{analytics.averages.mood.toFixed(1)}/10</strong>
        </div>

        <div className="summary-card">
          <span>Energy</span>
          <strong>{analytics.averages.energy.toFixed(1)}/10</strong>
        </div>

        <div className="summary-card">
          <span>Sleep</span>
          <strong>{analytics.averages.sleep.toFixed(1)}/10</strong>
        </div>

        <div className="summary-card">
          <span>Stress</span>
          <strong>{analytics.averages.stress.toFixed(1)}/10</strong>
        </div>

        <div className="summary-card">
          <span>Anxiety</span>
          <strong>{analytics.averages.anxiety.toFixed(1)}/10</strong>
        </div>

      </div>
    )}

    {!analyticsLoading &&
      !analyticsError &&
      analytics &&
      !analytics.averages && (
        <p>
          No wellness data yet. Complete your first check-in to see your wellness snapshot.
        </p>
      )}
</section>

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

        <section className="analytics-section">
  <div className="analytics-header">
  <p className="card-label">WELLNESS TRENDS</p>
  <h2>Mood & Stress</h2>
  <p>
    See how your mood and stress have changed over time.
  </p>
</div>

  {analyticsLoading && (
    <p>Loading your wellness trends...</p>
  )}

  {analyticsError && (
    <p>{analyticsError}</p>
  )}

  {!analyticsLoading &&
    !analyticsError &&
    analytics &&
    analytics.trends?.length > 0 && (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={analytics.trends}
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
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString([], {
                  day: "numeric",
                  month: "short",
                })
              }
            />

            <YAxis domain={[0, 10]} />

            <Tooltip
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString()
              }
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
    )}
</section> 

<section className="analytics-section secondary-analytics">
  <div className="analytics-header">
    <p className="card-label">ENERGY & SLEEP</p>
    <h2>Your energy and sleep</h2>
    <p>
      See how your energy and sleep have changed over time.
    </p>
  </div>

  {!analyticsLoading &&
    !analyticsError &&
    analytics &&
    analytics.trends?.length > 0 && (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={analytics.trends}
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
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString([], {
                  day: "numeric",
                  month: "short",
                })
              }
            />

            <YAxis domain={[0, 10]} />

            <Tooltip
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString()
              }
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
    )}
</section>

<section className="analytics-section">
  <div className="analytics-header">
    <p className="card-label">EMOTION PATTERNS</p>
    <h2>Your emotions</h2>
    <p>
      See which emotions you've experienced most often.
    </p>
  </div>

  {!analyticsLoading &&
    !analyticsError &&
    emotionData.length > 0 && (
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
      key={`cell-${entry.emotion}`}
      fill={emotionColors[index % emotionColors.length]}
    />
  ))}
</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
</section>

       <section className="analytics-section">
  <div className="analytics-header">
    <p className="card-label">DISTRESS TREND</p>
    <h2>Your distress over time</h2>
    <p>
      Track how your distress score has changed across your check-ins.
    </p>
  </div>

  {entries.filter((entry) => entry.distressScore !== undefined).length > 0 ? (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={[...entries]
            .filter((entry) => entry.distressScore !== undefined)
            .reverse()}
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
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString([], {
                day: "numeric",
                month: "short",
              })
            }
          />

          <YAxis domain={[0, 100]} />

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