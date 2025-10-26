import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import useEventsQuery from "../features/events/queries/useEventsQuery";
import useRefreshEventsMutation from "../features/events/mutations/useRefreshEventsMutation";
import EventList from "../features/events/EventList";

const EventsPage = () => {
  const { data, isLoading: isLoadingEvents } = useEventsQuery();

  const { mutate: refreshEvents, isPending: isRefreshing } =
    useRefreshEventsMutation();

  const [dateRange, setDateRange] = useState<number>(7);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" component="h1">
            Upcoming Events
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refreshEvents()}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {}}
            >
              New Event
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <ToggleButtonGroup
            value={dateRange}
            exclusive
            onChange={(_, value) => value !== null && setDateRange(value)}
            aria-label="date range"
          >
            <ToggleButton value={1} aria-label="1 day">
              1 Day
            </ToggleButton>
            <ToggleButton value={7} aria-label="7 days">
              7 Days
            </ToggleButton>
            <ToggleButton value={30} aria-label="30 days">
              30 Days
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {isLoadingEvents ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <EventList events={data?.events || []} dateRange={dateRange} />
        )}
      </Box>
    </Container>
  );
};

export default EventsPage;
