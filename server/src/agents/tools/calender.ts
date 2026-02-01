import { google } from "googleapis";

const parseDuration = (duration: string) => {
  if (duration.includes("minute")) {
    const minutes = parseInt(duration);
    return minutes * 60 * 1000;
  } else if (duration.includes("hour")) {
    const hours = parseInt(duration);
    return hours * 60 * 60 * 1000;
  } else if (duration.includes("day")) {
    const days = parseInt(duration);
    return days * 24 * 60 * 60 * 1000;
  }
  return 15 * 60 * 1000;
};

export const addToCalendar = async (
  userToken: string,
  content: string,
  duration?: string,
) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: userToken });

  const calendar = google.calendar({ version: "v3", auth });

  const start = new Date();
  const end = duration
    ? new Date(start.getTime() + parseDuration(duration))
    : new Date(start.getTime() + 15 * 60 * 1000);

  const event = {
    summary: content,
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
  };

  await calendar.events.insert({ calendarId: "primary", requestBody: event });
  return { status: "scheduled" };
};
