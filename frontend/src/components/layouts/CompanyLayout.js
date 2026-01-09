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
import BusinessIcon from "@mui/icons-material/Business";
import ServiceIcon from "@mui/icons-material/Category";
import MembershipIcon from "@mui/icons-material/CardMembership";
import CampaignIcon from "@mui/icons-material/Campaign";
import BookingIcon from "@mui/icons-material/BookOnline";
import PaymentIcon from "@mui/icons-material/Payment";
import MediaIcon from "@mui/icons-material/PhotoLibrary";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";

const drawerWidth = 260;

const fallbackCompanyRoutes = {
  LOGIN: "/company/login",
  DASHBOARD: (companyId) => `/company/${companyId}/dashboard`,
  BRANCHES: (companyId) => `/company/${companyId}/branches`,
  SERVICES: (companyId) => `/company/${companyId}/services`,
  MEMBERSHIP_PLANS: (companyId) => `/company/${companyId}/membership-plans`,
  CAMPAIGNS: (companyId) => `/company/${companyId}/campaigns`,
  BOOKINGS: (companyId) => `/company/${companyId}/bookings`,
  PAYMENTS: (companyId) => `/company/${companyId}/payments`,
  MEDIA: (companyId) => `/company/${companyId}/media`,
  STAFF: (companyId) => `/company/${companyId}/staff`,
};

export const CompanyLayout = ({ children }) => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();

  // Fallback user (in case AuthContext not ready)
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const user = authUser || storedUser;

  // companyId: prefer URL -> user -> roles
  const companyId =
    params.companyId ||
    user?.company_id ||
    user?.company?.id ||
    user?.roles?.[0]?.company_id ||
    user?.roles?.[0]?.company?.id ||
    "";

  // routes: prefer ROUTES if exists, else fallback
  const R = useMemo(() => {
    const hasRoutes = ROUTES?.COMPANY?.DASHBOARD;
    return hasRoutes ? ROUTES.COMPANY : fallbackCompanyRoutes;
  }, []);

  const companyName =
    user?.company?.name ||
    user?.roles?.[0]?.company?.name ||
    user?.company_name ||
    "Company";

  const roleName =
    user?.roles?.[0]?.role ||
    user?.role ||
    "company_user";

  // ✅ Left menu items: SAME labels/order as your current CompanyLayout (not changed)
  const menuItems = useMemo(() => {
    if (!companyId) return [];

    return [
      { text: "Dashboard", icon: <DashboardIcon />, to: R.DASHBOARD(companyId) },
      { text: "Branches", icon: <BusinessIcon />, to: R.BRANCHES(companyId) },
      { text: "Services", icon: <ServiceIcon />, to: R.SERVICES(companyId) },
      { text: "Membership Plans", icon: <MembershipIcon />, to: R.MEMBERSHIP_PLANS(companyId) },
      { text: "Campaigns", icon: <CampaignIcon />, to: R.CAMPAIGNS(companyId) },
      { text: "Bookings", icon: <BookingIcon />, to: R.BOOKINGS(companyId) },
      { text: "Payments", icon: <PaymentIcon />, to: R.PAYMENTS(companyId) },
      { text: "Media", icon: <MediaIcon />, to: R.MEDIA(companyId) },
      { text: "Staff", icon: <PeopleIcon />, to: R.STAFF(companyId) },
    ];
  }, [R, companyId]);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleCloseMenu();
    try {
      await logout();
    } catch {
      // ignore
    }
    navigate(R.LOGIN || fallbackCompanyRoutes.LOGIN, { replace: true });
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Bar (same look/feel as BranchLayout) */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              Company Console
            </Typography>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5 }}>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {companyName}
              </Typography>

              <Chip
                size="small"
                label={roleName}
                variant="outlined"
                sx={{ color: "white", borderColor: "rgba(255,255,255,0.35)" }}
              />
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
                    {user?.name || "Company User"}
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

      {/* Left Drawer (don’t change menu items, just styling like BranchLayout) */}
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
            {companyName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Company: {companyId || "—"}
          </Typography>
        </Box>

        <Divider />

        <List sx={{ px: 1 }}>
          {menuItems.map((item) => {
            const selected = location.pathname.startsWith(item.to);
            return (
              <ListItemButton
                key={item.text}
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
                <ListItemText primary={item.text} />
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
