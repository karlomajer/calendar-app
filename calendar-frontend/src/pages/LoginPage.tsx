import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import useGetAuthUrlMutation from "../features/auth/mutations/useGetAuthUrlMutation";
import useHandleCallbackMutation from "../features/auth/mutations/useHandleCallbackMutation";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { mutate: getAuthUrl, isPending: isGettingAuthUrl } =
    useGetAuthUrlMutation();

  const { mutate: handleCallback, isPending: isHandlingCallback } =
    useHandleCallbackMutation();

  const callbackProcessedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const code = searchParams.get("code");

    // Prevent duplicate callback processing
    if (code && !callbackProcessedRef.current) {
      callbackProcessedRef.current = true;

      // The onSuccess and onError callbacks defined here are additional to those in the mutation (mutation-level callbacks will be executed first)
      handleCallback(code, {
        onSuccess: () => {
          navigate("/", { replace: true });
        },
        onError: () => {
          callbackProcessedRef.current = false;
        },
      });
    }
  }, [searchParams, navigate, handleCallback]);

  const handleLogin = () => {
    getAuthUrl(undefined, {
      onError: () => {
        toast.error("Failed to initiate login. Please try again.");
      },
    });
  };

  const isLoading = authLoading || isGettingAuthUrl || isHandlingCallback;

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Calendar App
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Sign in with your Google account to access your calendar events
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={handleLogin}
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
