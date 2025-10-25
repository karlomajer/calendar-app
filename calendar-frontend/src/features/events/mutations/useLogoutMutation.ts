import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import authApiClient from "../../../api/clients/authApiClient";

const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApiClient.logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
    onError: (error) => {
      console.error("Error during logout:", error);
      toast.error("Failed to logout. Please try again.");
    },
  });
};

export default useLogoutMutation;
