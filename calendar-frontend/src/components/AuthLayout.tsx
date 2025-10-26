import type { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuth from "../hooks/useAuth";
import useLogoutMutation from "../features/events/mutations/useLogoutMutation";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { user } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Calendar
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => logout()}
            disabled={isLoggingOut}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};

export default AuthLayout;
