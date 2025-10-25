import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import authApiClient from "../../../api/clients/authApiClient";
import { QUERY_KEYS } from "../../../api/config/queryKeys";

const useHandleCallbackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => authApiClient.handleCallback(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_USER });

      // Clear the code from URL
      window.history.replaceState({}, document.title, "/login");
    },
    onError: () => {
      toast.error("Authentication failed. Please try again.");
    },
  });
};

export default useHandleCallbackMutation;
