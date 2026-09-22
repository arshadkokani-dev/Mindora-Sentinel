const getRiskLevel = (score) => {
  if (score >= 75) return "Critical";
  if (score >= 50) return "High";
  if (score >= 25) return "Moderate";
  return "Low";
};

export const calculatePredictiveRisk = (entries = []) => {
  if (!entries || entries.length < 3) {
    return {
      status: "Insufficient Data",
      predictedRiskLevel: null,
      projectedScore: null,
      trend: "Unknown",
      confidence: "Low",
      reasons: [
        "At least 3 historical check-ins are required for prediction.",
      ],
    };
  }

  const recentEntries = entries.slice(-5);

  const scores = recentEntries
    .map((entry) => entry.distressScore)
    .filter((score) => typeof score === "number");

  if (scores.length < 3) {
    return {
      status: "Insufficient Data",
      predictedRiskLevel: null,
      projectedScore: null,
      trend: "Unknown",
      confidence: "Low",
      reasons: [
        "Not enough valid distress scores are available for prediction.",
      ],
    };
  }

  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];

  const slope =
    (lastScore - firstScore) /
    (scores.length - 1);

  const projectedScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(lastScore + slope * 2)
    )
  );

  const predictedRiskLevel =
    getRiskLevel(projectedScore);

  const increasingSteps = scores.reduce(
    (count, score, index) => {
      if (index === 0) return count;

      return score > scores[index - 1]
        ? count + 1
        : count;
    },
    0
  );

  const decreasingSteps = scores.reduce(
    (count, score, index) => {
      if (index === 0) return count;

      return score < scores[index - 1]
        ? count + 1
        : count;
    },
    0
  );

  let trend = "Stable";

  if (increasingSteps >= scores.length - 2) {
    trend = "Increasing";
  } else if (decreasingSteps >= scores.length - 2) {
    trend = "Decreasing";
  }

  const reasons = [];

  if (trend === "Increasing") {
    reasons.push(
      "Recent distress scores show a consistent upward trend."
    );
  }

  if (projectedScore > lastScore) {
    reasons.push(
      `Projected distress score may increase from ${lastScore} to approximately ${projectedScore}.`
    );
  }

  if (
    predictedRiskLevel === "High" ||
    predictedRiskLevel === "Critical"
  ) {
    reasons.push(
      `The projected score falls in the ${predictedRiskLevel} risk range.`
    );
  }

  let confidence = "Medium";

  if (scores.length >= 5 && trend !== "Stable") {
    confidence = "High";
  }

  if (trend === "Stable") {
    confidence = "Medium";
  }

  return {
    status:
      predictedRiskLevel === "High" ||
      predictedRiskLevel === "Critical"
        ? "Escalation Risk"
        : "No Immediate Escalation",

    predictedRiskLevel,
    projectedScore,
    trend,
    confidence,
    reasons,
  };
};