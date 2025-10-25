import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "../api/config/queryKeys";
import authApiClient from "../api/clients/authApiClient";

const useUserQuery = () =>
  useQuery({
    queryKey: QUERY_KEYS.CURRENT_USER,
    queryFn: authApiClient.getCurrentUser,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error("Error loading user:", error);
      toast.error("Failed to load user. Please try refreshing.");
    },
  });

export default useUserQuery;
