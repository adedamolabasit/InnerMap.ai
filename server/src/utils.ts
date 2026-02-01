export const resolveDueString = (duration?: string): string => {
  if (!duration) return "today";

  const normalized = duration.toLowerCase().trim();

  if (normalized.includes("today")) return "today";
  if (normalized.includes("tomorrow")) return "tomorrow";
  if (normalized.includes("week")) return "next week";

  const durationMatch = normalized.match(
    /(\d+)\s*(minute|minutes|hour|hours|day|days)/,
  );
  if (durationMatch) {
    const amount = parseInt(durationMatch[1]);
    const unit = durationMatch[2];

    const now = new Date();

    switch (unit) {
      case "minute":
      case "minutes":
        now.setMinutes(now.getMinutes() + amount);
        break;
      case "hour":
      case "hours":
        now.setHours(now.getHours() + amount);
        break;
      case "day":
      case "days":
        now.setDate(now.getDate() + amount);
        break;
    }

    return now.toISOString().split("T")[0];
  }

  return "today";
};
