export const calculateEngagement = ({
  wellnessEntries = [],
  journalEntries = [],
}) => {
  const totalCheckIns = wellnessEntries.length;
  const totalJournalEntries = journalEntries.length;

  const allInteractions = [
    ...wellnessEntries.map((entry) => new Date(entry.date)),
    ...journalEntries.map((entry) => new Date(entry.date)),
  ].filter((date) => !Number.isNaN(date.getTime()));

  if (allInteractions.length === 0) {
    return {
      status: "No Activity",
      trend: "Unknown",
      totalCheckIns: 0,
      totalJournalEntries: 0,
      lastInteraction: null,
      daysSinceLastInteraction: null,
    };
  }

  const latestInteraction = new Date(
    Math.max(...allInteractions.map((date) => date.getTime()))
  );

  const now = new Date();

  const daysSinceLastInteraction = Math.max(
    0,
    Math.floor(
      (now.getTime() - latestInteraction.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  let status;

  if (daysSinceLastInteraction <= 2) {
    status = "Active";
  } else if (daysSinceLastInteraction <= 7) {
    status = "Moderate Activity";
  } else {
    status = "Low Activity";
  }

  let trend = "Stable";

  if (wellnessEntries.length >= 3) {
    const recentEntries = wellnessEntries.slice(-3);

    const firstDate = new Date(recentEntries[0].date);
    const lastDate = new Date(
      recentEntries[recentEntries.length - 1].date
    );

    const interval =
      (lastDate.getTime() - firstDate.getTime()) /
      (1000 * 60 * 60 * 24);

    if (interval <= 14) {
      trend = "Consistent";
    } else {
      trend = "Decreasing";
    }
  }

  return {
    status,
    trend,
    totalCheckIns,
    totalJournalEntries,
    lastInteraction: latestInteraction,
    daysSinceLastInteraction,
  };
};