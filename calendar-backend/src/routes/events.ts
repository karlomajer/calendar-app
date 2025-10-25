import { Router, Request, Response } from "express";
import { db } from "../db";
import { events, users } from "../db/schema";
import { eq, and } from "drizzle-orm";
import {
  fetchCalendarEvents,
  createCalendarEvent,
} from "../services/calendarService";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.session!.userId!;

    const userEvents = await db
      .select({
        id: events.id,
        name: events.name,
        startDateTime: events.startDateTime,
        endDateTime: events.endDateTime,
        googleEventId: events.googleEventId,
      })
      .from(events)
      .where(eq(events.userId, userId))
      .orderBy(events.startDateTime);

    res.json({ events: userEvents });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const userId = req.session!.userId!;

    const userList = await db.select().from(users).where(eq(users.id, userId));

    if (userList.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userList[0];

    const calendarEvents = await fetchCalendarEvents(
      user.accessToken,
      user.refreshToken
    );

    await db.delete(events).where(eq(events.userId, userId));

    if (calendarEvents.length > 0) {
      const eventsToInsert = calendarEvents.map((event) => ({
        userId: userId as string,
        googleEventId: event.id,
        name: event.summary,
        startDateTime: new Date(event.start.dateTime),
        endDateTime: new Date(event.end.dateTime),
      }));

      await db.insert(events).values(eventsToInsert);
    }

    res.json({
      message: "Events refreshed successfully",
      count: calendarEvents.length,
    });
  } catch (error) {
    console.error("Refresh events error:", error);
    res.status(500).json({ error: "Failed to refresh events" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = req.session!.userId!;
    const { name, date, startTime, endTime } = req.body;

    if (!name || !date || !startTime || !endTime) {
      return res.status(400).json({
        error: "Missing required fields: name, date, startTime, endTime",
      });
    }

    const userList = await db.select().from(users).where(eq(users.id, userId));

    if (userList.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userList[0];

    const calendarEvent = await createCalendarEvent(
      user.accessToken,
      user.refreshToken,
      { name, date, startTime, endTime }
    );

    const calendarEvents = await fetchCalendarEvents(
      user.accessToken,
      user.refreshToken
    );

    await db.delete(events).where(eq(events.userId, userId));

    if (calendarEvents.length > 0) {
      const eventsToInsert = calendarEvents.map((event) => ({
        userId: userId as string,
        googleEventId: event.id,
        name: event.summary,
        startDateTime: new Date(event.start.dateTime),
        endDateTime: new Date(event.end.dateTime),
      }));

      await db.insert(events).values(eventsToInsert);
    }

    res.status(201).json({
      message: "Event created successfully",
      event: {
        id: calendarEvent.id,
        name: calendarEvent.summary,
        startDateTime: calendarEvent.start.dateTime,
        endDateTime: calendarEvent.end.dateTime,
      },
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

export default router;
