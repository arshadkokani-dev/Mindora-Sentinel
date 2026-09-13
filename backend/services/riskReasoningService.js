export const calculateRiskReasoning = ({
  mood,
  energy,
  sleep,
  stress,
  anxiety,
}) => {
  const factors = [];

  if (stress >= 7) {
    factors.push({
      factor: "Stress",
      value: stress,
      impact: "High",
      explanation: "Elevated stress is contributing significantly to distress.",
    });
  } else if (stress >= 5) {
    factors.push({
      factor: "Stress",
      value: stress,
      impact: "Moderate",
      explanation: "Moderate stress is contributing to the current distress level.",
    });
  }

  if (anxiety >= 7) {
    factors.push({
      factor: "Anxiety",
      value: anxiety,
      impact: "High",
      explanation: "Elevated anxiety is contributing significantly to distress.",
    });
  } else if (anxiety >= 5) {
    factors.push({
      factor: "Anxiety",
      value: anxiety,
      impact: "Moderate",
      explanation: "Moderate anxiety is contributing to the current distress level.",
    });
  }

  if (sleep <= 4) {
    factors.push({
      factor: "Sleep",
      value: sleep,
      impact: "High",
      explanation: "Reduced sleep is contributing to the current distress level.",
    });
  } else if (sleep <= 6) {
    factors.push({
      factor: "Sleep",
      value: sleep,
      impact: "Moderate",
      explanation: "Sleep quality may be contributing to the current distress level.",
    });
  }

  if (mood <= 4) {
    factors.push({
      factor: "Mood",
      value: mood,
      impact: "High",
      explanation: "Low mood is contributing significantly to distress.",
    });
  } else if (mood <= 6) {
    factors.push({
      factor: "Mood",
      value: mood,
      impact: "Moderate",
      explanation: "Mood is contributing moderately to the current distress level.",
    });
  }

  if (energy <= 4) {
    factors.push({
      factor: "Energy",
      value: energy,
      impact: "High",
      explanation: "Low energy is contributing significantly to distress.",
    });
  } else if (energy <= 6) {
    factors.push({
      factor: "Energy",
      value: energy,
      impact: "Moderate",
      explanation: "Reduced energy may be contributing to the current distress level.",
    });
  }

  return {
    factors,
    factorCount: factors.length,
  };
};