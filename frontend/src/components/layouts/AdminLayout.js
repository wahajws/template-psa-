import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  History as HistoryIcon,
  Timeline as ActivityIcon,
  Analytics as BehaviourIcon,
  Code as DeveloperIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: ROUTES.ADMIN.DASHBOARD },
  { text: "Companies", icon: <BusinessIcon />, path: ROUTES.ADMIN.COMPANIES },
  { text: "User Activity", icon: <ActivityIcon />, path: ROUTES.ADMIN.ACTIVITY },
  { text: "Behaviour Logs", icon: <BehaviourIcon />, path: ROUTES.ADMIN.BEHAVIOUR },
  { text: "Audit Logs", icon: <HistoryIcon />, path: ROUTES.ADMIN.AUDIT_LOGS },
  { text: "Developer Console", icon: <DeveloperIcon />, path: ROUTES.ADMIN.DEVELOPER_CONSOLE },
];

export const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.ADMIN.LOGIN);
  };

  // Drawer content (white section starts after blue top)
  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Blue header same as top bar */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 2,
          height: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
          Platform Admin
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Admin Console
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Unified blue top bar across entire width */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "primary.main",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                Pickleball Booking Platform
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5 }}>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Platform Admin
                </Typography>
                <Chip
                  size="small"
                  label="admin"
                  variant="outlined"
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.35)" }}
                />
              </Box>
            </Box>
          </Box>

          {/* User Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
              {user?.email || user?.name || "Admin"}
            </Typography>

            <Tooltip title="Account">
              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar sx={{ width: 34, height: 34 }}>
                  {user?.first_name?.[0] || user?.email?.[0] || "A"}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {user?.name || "Admin"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || ""}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  navigate(ROUTES.ADMIN.PROFILE);
                  handleMenuClose();
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
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

      {/* Drawer (same logic) */}
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
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
