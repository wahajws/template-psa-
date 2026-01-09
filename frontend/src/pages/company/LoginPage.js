import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/common/Toast";
import { ROUTES } from "../../utils/constants";
import { storage } from "../../utils/storage";

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const getCompanyIdFromAnyUserShape = (u) => {
    if (!u) return "";

    return (
      u.company_id ||
      u.company?.id ||
      u.roles?.[0]?.company_id ||
      u.roles?.[0]?.company?.id ||
      ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(identifier, password);

      if (result?.success) {
        showToast("Login successful", "success");

        // Prefer freshest user in result, else AuthContext user, else storage.
        const resultUser = result?.user || result?.data?.user;
        const storedUser = storage.get("user");
        const finalUser = resultUser || user || storedUser;

        const companyId = getCompanyIdFromAnyUserShape(finalUser);

        if (companyId) {
          navigate(ROUTES.COMPANY.DASHBOARD(companyId), { replace: true });
        } else {
          // if you really have this page, keep it; otherwise change to any valid page
          navigate("/company/select", { replace: true });
        }
      } else {
        setError(result?.error || "Login failed");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Company Admin Login
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}
          >
            Sign in to manage your company
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email or Phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              margin="normal"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};
