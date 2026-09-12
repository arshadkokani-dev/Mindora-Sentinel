export const calculateDistressTrend = (entries) => {
  if (!entries || entries.length < 2) {
    return {
      trend: "Stable",
      change: 0,
    };
  }

  const latest = entries[entries.length - 1].distressScore;
  const previous = entries[entries.length - 2].distressScore;

  const change = latest - previous;

  let trend;

  if (change >= 5) {
    trend = "Increasing";
  } else if (change <= -5) {
    trend = "Decreasing";
  } else {
    trend = "Stable";
  }

  return {
    trend,
    change,
  };
};