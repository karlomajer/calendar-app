import axiosInstance from "../config/axiosInstance";

export interface User {
  id: string;
  email: string;
}

const authApiClient = {
  getAuthUrl: () =>
    axiosInstance
      .get<{ authUrl: string }>("/auth/google")
      .then((res) => res.data),

  handleCallback: (code: string) =>
    axiosInstance
      .get<{ message: string; user: User }>(
        `/auth/google/callback?code=${code}`
      )
      .then((res) => res.data),

  getCurrentUser: () =>
    axiosInstance.get<{ user: User }>("/auth/me").then((res) => res.data),

  logout: () =>
    axiosInstance
      .post<{ message: string }>("/auth/logout")
      .then((res) => res.data),
};

export default authApiClient;
