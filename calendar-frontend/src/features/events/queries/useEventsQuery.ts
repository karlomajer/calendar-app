import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "../../../api/config/queryKeys";
import calendarApiClient from "../../../api/clients/calendarApiClient";

const useEventsQuery = () =>
  useQuery({
    queryKey: QUERY_KEYS.EVENTS,
    queryFn: calendarApiClient.getEvents,
    staleTime: 30000,
    retry: 2,
    onError: (error) => {
      console.error("Error loading events:", error);
      toast.error("Failed to load events. Please try refreshing.");
    },
  });

export default useEventsQuery;
