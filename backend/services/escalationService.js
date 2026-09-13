export const calculateEscalation = (entries) => {
  if (!entries || entries.length < 2) {
    return {
      status: "Stable",
      severity: "Low",
      scoreChange: 0,
      consecutiveIncrease: false,
      highRiskCount: 0,
      reasons: [
        "Not enough check-ins to determine a longitudinal escalation pattern.",
      ],
    };
  }

  // Analytics entries are ordered oldest → newest.
  const recentEntries = entries.slice(-3);

  const scores = recentEntries
    .map((entry) => entry.distressScore)
    .filter((score) => typeof score === "number");

  if (scores.length < 2) {
    return {
      status: "Stable",
      severity: "Low",
      scoreChange: 0,
      consecutiveIncrease: false,
      highRiskCount: 0,
      reasons: [
        "Not enough valid distress scores to determine escalation.",
      ],
    };
  }

  const latestScore = scores[scores.length - 1];
  const previousScore = scores[scores.length - 2];

  const scoreChange = latestScore - scores[0];

  const consecutiveIncrease =
    scores.length >= 3 &&
    scores.every((score, index) => {
      if (index === 0) return true;
      return score > scores[index - 1];
    });

  const consecutiveDecrease =
    scores.length >= 3 &&
    scores.every((score, index) => {
      if (index === 0) return true;
      return score < scores[index - 1];
    });

  const highRiskCount = recentEntries.filter(
    (entry) =>
      entry.riskLevel === "High" ||
      entry.riskLevel === "Critical"
  ).length;

  const reasons = [];

  let status = "Stable";
  let severity = "Low";

  /*
   * Improving pattern
   */
  if (consecutiveDecrease && scoreChange <= -5) {
    status = "Improving";
    severity = "Low";

    reasons.push(
      `Distress decreased by ${Math.abs(scoreChange)} points across the recent check-ins.`
    );
  }

  /*
   * Critical escalation
   */
  else if (
    latestScore >= 75 &&
    consecutiveIncrease &&
    scoreChange >= 10
  ) {
    status = "Critical Escalation";
    severity = "Critical";

    reasons.push(
      `Distress increased by ${scoreChange} points across the recent check-ins.`
    );

    reasons.push(
      "Distress has increased across consecutive check-ins."
    );

    reasons.push(
      "Current distress is in the Critical range."
    );
  }

  /*
   * Escalating pattern
   */
  else if (
    consecutiveIncrease &&
    scoreChange >= 10 &&
    (latestScore >= 50 || highRiskCount >= 1)
  ) {
    status = "Escalating";
    severity = latestScore >= 75 ? "Critical" : "High";

    reasons.push(
      `Distress increased by ${scoreChange} points across the recent check-ins.`
    );

    reasons.push(
      "Distress has increased across consecutive check-ins."
    );

    if (highRiskCount > 0) {
      reasons.push(
        `${highRiskCount} recent check-in(s) show High or Critical risk.`
      );
    }
  }

  /*
   * Watch pattern
   */
  else if (scoreChange >= 5 || highRiskCount >= 1) {
    status = "Watch";
    severity = latestScore >= 75 ? "Critical" : "Moderate";

    if (scoreChange >= 5) {
      reasons.push(
        `Distress increased by ${scoreChange} points across the recent check-ins.`
      );
    }

    if (highRiskCount > 0) {
      reasons.push(
        `${highRiskCount} recent check-in(s) show High or Critical risk.`
      );
    }
  }

  /*
   * Stable pattern
   */
  else {
    status = "Stable";
    severity = latestScore >= 50 ? "High" : "Low";

    reasons.push(
      "No significant longitudinal deterioration was detected."
    );
  }

  return {
    status,
    severity,
    scoreChange,
    consecutiveIncrease,
    highRiskCount,
    reasons,
  };
};