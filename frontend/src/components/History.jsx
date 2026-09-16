import { useEffect, useState } from "react";
import "../styles/history.css";

function History() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/wellness",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load wellness history");
        }

        const data = await response.json();

        setEntries(data.entries || []);
      } catch (err) {
        console.error("History error:", err);
        setError("Unable to load your wellness history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="dashboard-content">
        <section className="analytics-section">
          <div className="analytics-header">
            <p className="card-label">WELLNESS HISTORY</p>
            <h1>Your History</h1>
            <p>Loading your previous check-ins...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-content">
        <section className="analytics-section">
          <div className="analytics-header">
            <p className="card-label">WELLNESS HISTORY</p>
            <h1>Your History</h1>
            <p>{error}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-content">

      <section className="analytics-section">

        <div className="analytics-header">
          <p className="card-label">WELLNESS HISTORY</p>

          <h1>Your History</h1>

          <p>
            Review your previous wellness check-ins and
            how your distress indicators have changed over time.
          </p>
        </div>


        {entries.length === 0 ? (

          <div className="history-empty-state">
            <h3>No check-ins yet</h3>

            <p>
              Complete your first wellness check-in to start
              building your personal history.
            </p>

          </div>

        ) : (

          <div className="history-list">

            {entries.map((entry) => (

              <article
                className="history-card"
                key={entry._id}
              >

                <div className="history-card-header">

                  <div>
                    <span className="metric-label">
                      CHECK-IN
                    </span>

                    <h3>
                      {formatDate(entry.date)}
                    </h3>

                    <span className="history-time">
                      {formatTime(entry.date)}
                    </span>
                  </div>


                  <div className="history-risk">

                    <span className="metric-label">
                      RISK
                    </span>

                    <strong
                      className={`history-risk-badge ${
                        entry.riskLevel?.toLowerCase() || ""
                      }`}
                    >
                      {entry.riskLevel || "Not available"}
                    </strong>

                  </div>

                </div>


                <div className="history-metrics">

                  <div>
                    <span>Mood</span>
                    <strong>{entry.mood}/10</strong>
                  </div>

                  <div>
                    <span>Stress</span>
                    <strong>{entry.stress}/10</strong>
                  </div>

                  <div>
                    <span>Anxiety</span>
                    <strong>{entry.anxiety}/10</strong>
                  </div>

                  <div>
                    <span>Sleep</span>
                    <strong>{entry.sleep}/10</strong>
                  </div>

                  <div>
                    <span>Energy</span>
                    <strong>{entry.energy}/10</strong>
                  </div>

                  <div>
                    <span>Distress</span>
                    <strong>
                      {entry.distressScore ?? "—"}
                    </strong>
                  </div>

                </div>


                {(entry.emotion ||
                  entry.gratitude ||
                  entry.highlight ||
                  entry.journal) && (

                  <div className="history-details">

                    {entry.emotion && (
                      <div>
                        <span className="metric-label">
                          EMOTION
                        </span>

                        <p>{entry.emotion}</p>
                      </div>
                    )}

                    {entry.gratitude && (
                      <div>
                        <span className="metric-label">
                          GRATITUDE
                        </span>

                        <p>{entry.gratitude}</p>
                      </div>
                    )}

                    {entry.highlight && (
                      <div>
                        <span className="metric-label">
                          HIGHLIGHT
                        </span>

                        <p>{entry.highlight}</p>
                      </div>
                    )}

                    {entry.journal && (
                      <div>
                        <span className="metric-label">
                          JOURNAL
                        </span>

                        <p>{entry.journal}</p>
                      </div>
                    )}

                  </div>

                )}

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default History;