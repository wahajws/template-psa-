import React, { useMemo } from "react";
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
  Alert,
} from "@mui/material";
import {
  Assignment as BookingIcon,
  Payments as PaymentIcon,
  CardMembership as MembershipIcon,
  People as StaffIcon,
} from "@mui/icons-material";

import { BranchLayout } from "../../components/layouts/BranchLayout";
import { useApiQuery } from "../../hooks/useQuery";
import { API_ENDPOINTS } from "../../config/api";
import { Loading } from "../../components/common/Loading";
import { formatDateTime } from "../../utils/format";

export const DashboardPage = () => {
  const { companyId, branchId } = useParams();

  // --- Queries ---
  const { data: branchData, isLoading: branchLoading } = useApiQuery(
    ["branch", "detail", companyId, branchId],
    API_ENDPOINTS.BRANCHES.DETAIL(companyId, branchId),
    { enabled: !!companyId && !!branchId }
  );

  const { data: membershipsData, isLoading: membershipsLoading } = useApiQuery(
    ["branch", "memberships", branchId],
    API_ENDPOINTS.MEMBERSHIPS.MY_MEMBERSHIPS(companyId), // or specific branch endpoint if available
    { enabled: !!companyId }
  );

  const { data: bookingsData } = useApiQuery(
    ["branch", "bookings", branchId],
    API_ENDPOINTS?.BRANCH?.BOOKINGS?.LIST
      ? API_ENDPOINTS.BRANCH.BOOKINGS.LIST(companyId, branchId)
      : null,
    { enabled: !!companyId && !!branchId }
  );

  const { data: paymentsData } = useApiQuery(
    ["branch", "payments", branchId],
    API_ENDPOINTS?.BRANCH?.PAYMENTS?.LIST
      ? API_ENDPOINTS.BRANCH.PAYMENTS.LIST(companyId, branchId)
      : null,
    { enabled: !!companyId && !!branchId }
  );

  if (branchLoading || membershipsLoading) {
    return (
      <BranchLayout>
        <Loading />
      </BranchLayout>
    );
  }

  const branch = branchData?.data?.branch || branchData?.data || {};
  const memberships = Array.isArray(membershipsData?.data?.memberships)
    ? membershipsData.data.memberships
    : [];

  const bookings = Array.isArray(bookingsData?.data?.bookings)
    ? bookingsData.data.bookings
    : [];
  const payments = Array.isArray(paymentsData?.data?.payments)
    ? paymentsData.data.payments
    : [];

  // --- Counts ---
  const totalBookings = bookings.length;
  const totalPayments = payments.length;
  const activeMemberships = memberships.filter(
    (m) => m.status === "active"
  ).length;
  const pendingMemberships = memberships.filter(
    (m) => m.status === "pending"
  ).length;

  // --- UI ---
  return (
    <BranchLayout>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Branch Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {branch?.name} • {branch?.city}, {branch?.country}
        </Typography>

        {/* KPI cards */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <BookingIcon color="info" />
                  <Box>
                    <Typography variant="h5">{totalBookings}</Typography>
                    <Typography color="text.secondary">Bookings</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <PaymentIcon color="success" />
                  <Box>
                    <Typography variant="h5">{totalPayments}</Typography>
                    <Typography color="text.secondary">Payments</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <MembershipIcon color="primary" />
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
                  <MembershipIcon color="warning" />
                  <Box>
                    <Typography variant="h5">{pendingMemberships}</Typography>
                    <Typography color="text.secondary">Pending Memberships</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Branch info */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Branch Information
              </Typography>
              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: "grid", rowGap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{branch?.name || "—"}</Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Timezone
                </Typography>
                <Typography>{branch?.timezone || "UTC"}</Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Created
                </Typography>
                <Typography>
                  {branch?.created_at ? formatDateTime(branch.created_at) : "—"}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Address
              </Typography>
              <Divider sx={{ my: 1.5 }} />

              <Typography variant="body2" color="text.secondary">
                {branch?.address_line1}
              </Typography>
              {branch?.address_line2 && (
                <Typography variant="body2" color="text.secondary">
                  {branch.address_line2}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {[branch?.city, branch?.country].filter(Boolean).join(", ") || "—"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </BranchLayout>
  );
};
