import React from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  Store as BranchIcon,
  People as UsersIcon,
  CardMembership as MembershipIcon,
  History as ActivityIcon,
} from "@mui/icons-material";

import { CompanyLayout } from "../../components/layouts/CompanyLayout";
import { useApiQuery } from "../../hooks/useQuery";
import { API_ENDPOINTS } from "../../config/api";
import { Loading } from "../../components/common/Loading";
import { formatDateTime } from "../../utils/format";

export const DashboardPage = () => {
  const { companyId } = useParams();

  // Only call API when companyId exists
  const { data: branchesData, isLoading: branchesLoading } = useApiQuery(
    ["company", "branches", companyId],
    API_ENDPOINTS.BRANCHES.LIST(companyId),
    { enabled: !!companyId }
  );

  const { data: membershipsData, isLoading: membershipsLoading } = useApiQuery(
    ["company", "memberships", companyId],
    API_ENDPOINTS.MEMBERSHIPS.MY_MEMBERSHIPS(companyId),
    { enabled: !!companyId }
  );

  // Add this endpoint (see below) if you have activity in backend
  const { data: activityData, isLoading: activityLoading } = useApiQuery(
    ["company", "activity", companyId],
    API_ENDPOINTS.COMPANY_ACTIVITY?.LIST
      ? API_ENDPOINTS.COMPANY_ACTIVITY.LIST(companyId, 5)
      : null,
    { enabled: !!companyId && !!API_ENDPOINTS.COMPANY_ACTIVITY?.LIST }
  );

  if (!companyId) {
    return (
      <CompanyLayout>
        <Typography sx={{ p: 3 }} color="error">
          Missing companyId in URL. Use: /company/1/dashboard
        </Typography>
      </CompanyLayout>
    );
  }

  if (branchesLoading || membershipsLoading || activityLoading) {
    return (
      <CompanyLayout>
        <Loading />
      </CompanyLayout>
    );
  }

  // ✅ SAFE arrays (prevents filter crash)
  const branches = Array.isArray(branchesData?.data?.branches) ? branchesData.data.branches : [];
  const memberships = Array.isArray(membershipsData?.data?.memberships) ? membershipsData.data.memberships : [];
  const activities = Array.isArray(activityData?.data?.activities) ? activityData.data.activities : [];

  const totalBranches = branches.length;
  const totalUsers = 0; // if you have users count endpoint, plug it
  const activeMemberships = memberships.filter((m) => m.status === "active").length;
  const pendingMemberships = memberships.filter((m) => m.status === "pending").length;

  return (
    <CompanyLayout>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Company Dashboard
        </Typography>

        {/* KPI cards */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <BranchIcon color="info" />
                  <Box>
                    <Typography variant="h5">{totalBranches}</Typography>
                    <Typography color="text.secondary">Total Branches</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <UsersIcon color="warning" />
                  <Box>
                    <Typography variant="h5">{totalUsers}</Typography>
                    <Typography color="text.secondary">Total Users</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <MembershipIcon color="success" />
                  <Box>
                    <Typography variant="h5">{activeMemberships}</Typography>
                    <Typography color="text.secondary">Active Memberships</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <MembershipIcon color="error" />
                  <Box>
                    <Typography variant="h5">{pendingMemberships}</Typography>
                    <Typography color="text.secondary">Pending Memberships</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Lists */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Branch list */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Branches
              </Typography>
              <List dense>
                {branches.length ? (
                  branches.slice(0, 5).map((b, idx) => (
                    <React.Fragment key={b.id}>
                      <ListItem>
                        <ListItemText
                          primary={b.name}
                          secondary={b.created_at ? formatDateTime(b.created_at) : ""}
                        />
                        <Chip
                          size="small"
                          label={b.status || "active"}
                          color={b.status === "inactive" ? "default" : "success"}
                        />
                      </ListItem>
                      {idx < Math.min(branches.length, 5) - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography sx={{ p: 2 }} color="text.secondary">
                    No branches found
                  </Typography>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Activity list */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent User Activity
              </Typography>

              {!API_ENDPOINTS.COMPANY_ACTIVITY?.LIST ? (
                <Typography sx={{ p: 2 }} color="text.secondary">
                  Activity endpoint not added yet
                </Typography>
              ) : (
                <List dense>
                  {activities.length ? (
                    activities.map((a, idx) => (
                      <React.Fragment key={a.id || idx}>
                        <ListItem>
                          <ActivityIcon sx={{ mr: 1, color: "primary.main" }} />
                          <ListItemText
                            primary={`${a.user_name || "User"} - ${a.action || "Activity"}`}
                            secondary={a.created_at ? formatDateTime(a.created_at) : ""}
                          />
                        </ListItem>
                        {idx < activities.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography sx={{ p: 2 }} color="text.secondary">
                      No recent activity
                    </Typography>
                  )}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Membership list */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Memberships
              </Typography>
              <List dense>
                {memberships.length ? (
                  memberships.slice(0, 8).map((m, idx) => (
                    <React.Fragment key={m.id || idx}>
                      <ListItem>
                        <ListItemText
                          primary={`${m.user_name || "Member"} (${m.plan_name || "Plan"})`}
                          secondary={
                            m.expiry_date ? `Expires: ${formatDateTime(m.expiry_date)}` : ""
                          }
                        />
                        <Chip
                          size="small"
                          label={m.status || "unknown"}
                          color={
                            m.status === "active"
                              ? "success"
                              : m.status === "pending"
                              ? "warning"
                              : "default"
                          }
                        />
                      </ListItem>
                      {idx < Math.min(memberships.length, 8) - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography sx={{ p: 2 }} color="text.secondary">
                    No memberships found
                  </Typography>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </CompanyLayout>
  );
};
