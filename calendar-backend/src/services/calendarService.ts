import { google } from "googleapis";
import { oauth2Client } from "./googleAuth";

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
}

export async function fetchCalendarEvents(
  accessToken: string,
  refreshToken: string
): Promise<CalendarEvent[]> {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const sixMonthsForward = new Date(now);
  sixMonthsForward.setMonth(now.getMonth() + 6);

  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin: sixMonthsAgo.toISOString(),
    timeMax: sixMonthsForward.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 2500, // NOTE: This is the Google Calendar API max limit
  });

  const events = response.data.items || [];

  return events
    .filter((event) => event.start?.dateTime && event.end?.dateTime)
    .map((event) => ({
      id: event.id!,
      summary: event.summary || "No Title",
      start: {
        dateTime: event.start!.dateTime!,
      },
      end: {
        dateTime: event.end!.dateTime!,
      },
    }));
}

export async function createCalendarEvent(
  accessToken: string,
  refreshToken: string,
  eventData: {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
  }
): Promise<CalendarEvent> {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const startDateTime = `${eventData.date}T${eventData.startTime}:00`;
  const endDateTime = `${eventData.date}T${eventData.endTime}:00`;

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: eventData.name,
      start: {
        dateTime: startDateTime,
        timeZone: "UTC",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "UTC",
      },
    },
  });

  const event = response.data;

  return {
    id: event.id!,
    summary: event.summary || "No Title",
    start: {
      dateTime: event.start!.dateTime!,
    },
    end: {
      dateTime: event.end!.dateTime!,
    },
  };
}
