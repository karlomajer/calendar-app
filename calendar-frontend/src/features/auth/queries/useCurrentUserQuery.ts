import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../api/config/queryKeys";
import authApiClient from "../../../api/clients/authApiClient";

const useCurrentUserQuery = () =>
  useQuery({
    queryKey: QUERY_KEYS.CURRENT_USER,
    queryFn: authApiClient.getCurrentUser,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minute
  });

export default useCurrentUserQuery;
