import axiosInstance from "../config/axiosInstance";

export interface CalendarEvent {
  id: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  googleEventId: string;
}

export interface CreateEventPayload {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
}

const calendarApiClient = {
  getEvents: () =>
    axiosInstance
      .get<{ events: CalendarEvent[] }>("/events")
      .then((res) => res.data),

  refreshEvents: () =>
    axiosInstance
      .post<{ message: string; count: number }>("/events/refresh")
      .then((res) => res.data),

  createEvent: (payload: CreateEventPayload) =>
    axiosInstance
      .post<{ message: string; event: CalendarEvent }>("/events", payload)
      .then((res) => res.data),
};

export default calendarApiClient;
