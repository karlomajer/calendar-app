import { useMutation } from "@tanstack/react-query";
import authApiClient from "../../../api/clients/authApiClient";

const useGetAuthUrlMutation = () =>
  useMutation({
    mutationFn: () => authApiClient.getAuthUrl(),
    onSuccess: (data) => {
      window.location.href = data.authUrl;
    },
  });

export default useGetAuthUrlMutation;
