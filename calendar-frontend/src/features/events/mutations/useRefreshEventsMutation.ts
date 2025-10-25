import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "../../../api/config/queryKeys";
import calendarApiClient from "../../../api/clients/calendarApiClient";

const useRefreshEventsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarApiClient.refreshEvents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
      toast.success("Events refreshed successfully!");
    },
    onError: (error) => {
      console.error("Error refreshing events:", error);
      toast.error("Failed to refresh events. Please try again.");
    },
  });
};

export default useRefreshEventsMutation;
