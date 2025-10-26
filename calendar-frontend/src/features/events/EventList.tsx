import { useMemo } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
} from "@mui/material";
import { type CalendarEvent } from "../../api/clients/calendarApiClient";
import {
  format,
  parseISO,
  startOfDay,
  addDays,
  startOfWeek,
  endOfWeek,
} from "date-fns";

interface EventListProps {
  events: CalendarEvent[];
  dateRange: number;
}

interface GroupedEvents {
  [key: string]: CalendarEvent[];
}

const EventList = ({ events, dateRange }: EventListProps) => {
  const groupedEvents = useMemo(() => {
    const now = new Date();
    const startDate = startOfDay(now);
    const endDate = addDays(startDate, dateRange);

    const filteredEvents = events.filter((event) => {
      const eventDate = parseISO(event.startDateTime);

      return eventDate >= startDate && eventDate < endDate;
    });

    const sortedEvents = filteredEvents.sort(
      (a, b) =>
        parseISO(a.startDateTime).getTime() -
        parseISO(b.startDateTime).getTime()
    );

    if (dateRange === 30) {
      const weekGroups: GroupedEvents = {};
      sortedEvents.forEach((event) => {
        const eventDate = parseISO(event.startDateTime);
        const weekStart = startOfWeek(eventDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(eventDate, { weekStartsOn: 1 });
        const weekKey = `${format(weekStart, "d MMM")} - ${format(
          weekEnd,
          "d MMM, yyyy"
        )}`;

        if (!weekGroups[weekKey]) {
          weekGroups[weekKey] = [];
        }
        weekGroups[weekKey].push(event);
      });

      return weekGroups;
    } else {
      const dayGroups: GroupedEvents = {};
      sortedEvents.forEach((event) => {
        const eventDate = parseISO(event.startDateTime);
        const dayKey = format(eventDate, "EEEE, d MMMM, yyyy");

        if (!dayGroups[dayKey]) {
          dayGroups[dayKey] = [];
        }
        dayGroups[dayKey].push(event);
      });

      return dayGroups;
    }
  }, [events, dateRange]);

  const groupKeys = Object.keys(groupedEvents);

  if (groupKeys.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No events found for the selected date range
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {groupKeys.map((groupKey) => (
        <Paper key={groupKey} sx={{ mb: 3, overflow: "hidden" }}>
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              p: 2,
            }}
          >
            <Typography variant="h6">{groupKey}</Typography>
          </Box>
          <List disablePadding>
            {groupedEvents[groupKey].map((event, index) => (
              <Box key={event.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={event.name}
                    secondary={`${format(
                      parseISO(event.startDateTime),
                      "H:mm"
                    )} - ${format(parseISO(event.endDateTime), "H:mm")}`}
                    slotProps={{
                      primary: {
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
};

export default EventList;
