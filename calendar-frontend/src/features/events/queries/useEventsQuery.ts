import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "../../../api/config/queryKeys";
import calendarApiClient from "../../../api/clients/calendarApiClient";

interface UseEventsQueryParams {
  isEnabled?: boolean;
}

const useEventsQuery = ({ isEnabled = true }: UseEventsQueryParams) =>
  useQuery({
    queryKey: QUERY_KEYS.EVENTS,
    queryFn: calendarApiClient.getEvents,
    staleTime: 30000,
    enabled: isEnabled,
    retry: 2,
    onError: (error) => {
      console.error("Error loading events:", error);
      toast.error("Failed to load events. Please try refreshing.");
    },
  });

export default useEventsQuery;
