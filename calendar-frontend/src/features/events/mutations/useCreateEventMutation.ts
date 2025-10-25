import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "../../../api/config/queryKeys";
import calendarApiClient from "../../../api/clients/calendarApiClient";

const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarApiClient.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
      toast.success("Event created successfully!");
    },
    onError: (error) => {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    },
  });
};

export default useCreateEventMutation;
