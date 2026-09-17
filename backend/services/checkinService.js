const CHECK_IN_INTERVAL_DAYS = 3;

export const calculateCheckInStatus = ({
  wellnessEntries = [],
  now = new Date(),
}) => {
  if (wellnessEntries.length === 0) {
    return {
      status: "Not Started",
      intervalDays: CHECK_IN_INTERVAL_DAYS,
      lastCheckIn: null,
      nextCheckInDue: null,
      daysUntilDue: null,
      daysOverdue: null,
    };
  }

  const sortedEntries = [...wellnessEntries]
    .map((entry) => ({
      ...entry,
      parsedDate: new Date(entry.date),
    }))
    .filter(
      (entry) => !Number.isNaN(entry.parsedDate.getTime())
    )
    .sort(
      (a, b) =>
        a.parsedDate.getTime() - b.parsedDate.getTime()
    );

  if (sortedEntries.length === 0) {
    return {
      status: "Not Started",
      intervalDays: CHECK_IN_INTERVAL_DAYS,
      lastCheckIn: null,
      nextCheckInDue: null,
      daysUntilDue: null,
      daysOverdue: null,
    };
  }

  const lastCheckIn =
    sortedEntries[sortedEntries.length - 1].parsedDate;

  const nextCheckInDue = new Date(lastCheckIn);

  nextCheckInDue.setDate(
    nextCheckInDue.getDate() + CHECK_IN_INTERVAL_DAYS
  );

  const differenceMs =
    nextCheckInDue.getTime() - now.getTime();

  const differenceDays =
    differenceMs / (1000 * 60 * 60 * 24);

  if (differenceDays > 0) {
    return {
      status: "Scheduled",
      intervalDays: CHECK_IN_INTERVAL_DAYS,
      lastCheckIn,
      nextCheckInDue,
      daysUntilDue: Math.ceil(differenceDays),
      daysOverdue: 0,
    };
  }

  const overdueDays = Math.max(
    0,
    Math.floor(Math.abs(differenceDays))
  );

  return {
    status: "Overdue",
    intervalDays: CHECK_IN_INTERVAL_DAYS,
    lastCheckIn,
    nextCheckInDue,
    daysUntilDue: 0,
    daysOverdue: overdueDays,
  };
};