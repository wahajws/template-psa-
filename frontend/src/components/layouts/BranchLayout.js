// src/components/layouts/BranchLayout.js
import React, { useMemo, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Chip,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BookingsIcon from "@mui/icons-material/Event";
import PaymentsIcon from "@mui/icons-material/Payments";
import StaffIcon from "@mui/icons-material/Group";
import ContactsIcon from "@mui/icons-material/Contacts";
import CourtsIcon from "@mui/icons-material/SportsTennis";
import HoursIcon from "@mui/icons-material/AccessTime";
import MediaIcon from "@mui/icons-material/PhotoLibrary";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../../contexts/AuthContext";
// If you have constants, use them. If not, keep fallback routes below.
import { ROUTES } from "../../utils/constants";

const drawerWidth = 260;

const fallbackBranchRoutes = {
  DASHBOARD: (companyId, branchId) => `/branch/${companyId}/${branchId}/dashboard`,
  BOOKINGS: (companyId, branchId) => `/branch/${companyId}/${branchId}/bookings`,
  PAYMENTS: (companyId, branchId) => `/branch/${companyId}/${branchId}/payments`,
  STAFF: (companyId, branchId) => `/branch/${companyId}/${branchId}/staff`,
  CONTACTS: (companyId, branchId) => `/branch/${companyId}/${branchId}/contacts`,
  COURTS: (companyId, branchId) => `/branch/${companyId}/${branchId}/courts`,
  BUSINESS_HOURS: (companyId, branchId) => `/branch/${companyId}/${branchId}/business-hours`,
  MEDIA: (companyId, branchId) => `/branch/${companyId}/${branchId}/media`,
};

export const BranchLayout = ({ children }) => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  // read ids from URL first, else from user
  const companyId =
    params.companyId || user?.company_id || user?.roles?.[0]?.company_id || "";

  const branchId =
    params.branchId || user?.branch_id || user?.roles?.[0]?.branch_id || "";

  // routes (prefer ROUTES if exists)
  const R = useMemo(() => {
    const hasRoutes = ROUTES?.BRANCH?.DASHBOARD;
    return hasRoutes ? ROUTES.BRANCH : fallbackBranchRoutes;
  }, []);

  const branchName =
    user?.branch?.name ||
    user?.roles?.[0]?.branch?.name ||
    user?.branch_name ||
    "Branch";

  const roleName =
    user?.roles?.[0]?.role ||
    user?.role ||
    "branch_user";

  // menu items (you can adjust)
  const navItems = useMemo(() => {
    if (!companyId || !branchId) return [];

    return [
      { label: "Dashboard", icon: <DashboardIcon />, to: R.DASHBOARD(companyId, branchId) },
      { label: "Contacts", icon: <ContactsIcon />, to: R.CONTACTS(companyId, branchId) },
      { label: "Courts", icon: <CourtsIcon />, to: R.COURTS(companyId, branchId) },
      { label: "Business Hours", icon: <HoursIcon />, to: R.BUSINESS_HOURS(companyId, branchId) },
      { label: "Bookings", icon: <BookingsIcon />, to: R.BOOKINGS(companyId, branchId) },
      { label: "Payments", icon: <PaymentsIcon />, to: R.PAYMENTS(companyId, branchId) },
      { label: "Staff", icon: <StaffIcon />, to: typeof R.STAFF === "function" ? R.STAFF(companyId, branchId) : `/branch/${companyId}/${branchId}/staff` },
      { label: "Media", icon: <MediaIcon />, to: R.MEDIA(companyId, branchId) },
    ];
  }, [R, companyId, branchId]);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleCloseMenu();
    try {
      await logout();
    } catch (e) {
      // ignore
    }
    navigate("/branch/login", { replace: true });
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              Branch Console
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5 }}>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {branchName}
              </Typography>
              <Chip size="small" label={roleName} variant="outlined" sx={{ color: "white", borderColor: "rgba(255,255,255,0.35)" }} />
            </Box>
          </Box>

          {/* User Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
              {user?.name || user?.email || "User"}
            </Typography>

            <Tooltip title="Account">
              <IconButton onClick={handleOpenMenu} size="small" sx={{ ml: 1 }}>
                <Avatar sx={{ width: 34, height: 34 }}>
                  {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleCloseMenu}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {user?.name || "Branch User"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || ""}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Left Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Company: {companyId || "—"} • Branch: {branchId || "—"}
          </Typography>
        </Box>

        <Divider />

        <List sx={{ px: 1 }}>
          {navItems.map((item) => {
            const selected = location.pathname === item.to;
            return (
              <ListItemButton
                key={item.label}
                component={RouterLink}
                to={item.to}
                selected={selected}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
