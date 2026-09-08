const normalizeInverse = (value) => {
  return ((10 - value) / 9) * 100;
};

const normalizeDirect = (value) => {
  return ((value - 1) / 9) * 100;
};

export const calculateDistressScore = ({
  mood,
  energy,
  sleep,
  stress,
  anxiety,
}) => {
  const moodDistress = normalizeInverse(mood);
  const energyDistress = normalizeInverse(energy);
  const sleepDistress = normalizeInverse(sleep);
  const stressDistress = normalizeDirect(stress);
  const anxietyDistress = normalizeDirect(anxiety);

  const score =
    moodDistress * 0.25 +
    stressDistress * 0.25 +
    anxietyDistress * 0.20 +
    sleepDistress * 0.15 +
    energyDistress * 0.15;

  const distressScore = Math.round(score);

  let riskLevel;

  if (distressScore < 25) {
    riskLevel = "Low";
  } else if (distressScore < 50) {
    riskLevel = "Moderate";
  } else if (distressScore < 75) {
    riskLevel = "High";
  } else {
    riskLevel = "Critical";
  }

  return {
    distressScore,
    riskLevel,
  };
};