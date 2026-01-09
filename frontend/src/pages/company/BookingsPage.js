// src/pages/company/BookingsPage.js
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

import { CompanyLayout } from "../../components/layouts/CompanyLayout";
import { Loading } from "../../components/common/Loading";
import { useToast } from "../../components/common/Toast";
import { useApiQuery, useApiUpdate } from "../../hooks/useQuery";
import { API_ENDPOINTS } from "../../config/api";
import { formatDateTime } from "../../utils/format";

// ⚠️ Change these to match your backend enum values
const BOOKING_STATUSES = ["pending", "confirmed", "cancelled", "completed", "no_show"];

export const BookingsPage = () => {
  const { companyId } = useParams();
  const { showToast } = useToast();

  // filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState(""); // yyyy-mm-dd
  const [toDate, setToDate] = useState(""); // yyyy-mm-dd

  // edit dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [editStatus, setEditStatus] = useState("pending");

  // -----------------------------
  // Endpoints (fallback style)
  // -----------------------------
  const baseListEndpoint =
    API_ENDPOINTS.BOOKINGS?.LIST
      ? API_ENDPOINTS.BOOKINGS.LIST(companyId)
      : API_ENDPOINTS.ADMIN?.COMPANY?.BOOKINGS
      ? API_ENDPOINTS.ADMIN.COMPANY.BOOKINGS(companyId)
      : `/admin/companies/${companyId}/bookings`;

  const updateEndpoint = (bookingId) =>
    API_ENDPOINTS.BOOKINGS?.UPDATE
      ? API_ENDPOINTS.BOOKINGS.UPDATE(companyId, bookingId)
      : `${baseListEndpoint}/${bookingId}`;

  // build query string for filters (only if your backend supports these params)
  const listEndpoint = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);

    const qs = params.toString();
    return qs ? `${baseListEndpoint}?${qs}` : baseListEndpoint;
  }, [baseListEndpoint, statusFilter, fromDate, toDate]);

  // -----------------------------
  // Fetch bookings
  // -----------------------------
  const { data, isLoading, error, refetch } = useApiQuery(
    ["company", "bookings", companyId, statusFilter, fromDate, toDate],
    listEndpoint,
    { enabled: !!companyId }
  );

  // handle multiple shapes
  const bookings = useMemo(() => {
    if (Array.isArray(data?.data?.bookings)) return data.data.bookings;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  // -----------------------------
  // Update booking status
  // -----------------------------
  const updateBooking = useApiUpdate((id) => updateEndpoint(id), {
    onSuccess: () => {
      showToast("Booking updated successfully", "success");
      setOpenDialog(false);
      setEditBooking(null);
      refetch();
    },
    onError: (err) => {
      showToast(err?.response?.data?.message || "Failed to update booking", "error");
    },
  });

  // -----------------------------
  // handlers
  // -----------------------------
  const handleOpenEdit = (booking) => {
    setEditBooking(booking);
    setEditStatus(booking?.status || "pending");
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!editBooking?.id) return;

    // payload (adjust if backend expects different field name)
    const payload = { status: editStatus };

    await updateBooking.mutateAsync({ id: editBooking.id, data: payload });
  };

  // -----------------------------
  // UI
  // -----------------------------
  if (isLoading) {
    return (
      <CompanyLayout>
        <Loading />
      </CompanyLayout>
    );
  }

  if (error) {
    return (
      <CompanyLayout>
        <Container maxWidth="lg" sx={{ mt: 3 }}>
          <Alert severity="error">
            {error?.response?.data?.message || "Failed to load bookings"}
          </Alert>
        </Container>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Bookings</Typography>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {BOOKING_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="From"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <TextField
              label="To"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />

            <Button variant="outlined" onClick={() => refetch()}>
              Apply
            </Button>

            <Button
              variant="text"
              onClick={() => {
                setStatusFilter("all");
                setFromDate("");
                setToDate("");
              }}
            >
              Clear
            </Button>
          </Box>
        </Paper>

        {/* Table */}
        <Paper sx={{ p: 2 }}>
          {bookings.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id} hover>
                    <TableCell>{String(b.id).slice(0, 8)}…</TableCell>

                    {/* customer fields vary a lot - handle common shapes */}
                    <TableCell>
                      {b.customer_name ||
                        b.user?.name ||
                        b.customer?.name ||
                        b.user?.email ||
                        "—"}
                    </TableCell>

                    <TableCell>{b.branch?.name || b.branch_name || b.branch_id || "—"}</TableCell>
                    <TableCell>{b.service?.name || b.service_name || b.service_id || "—"}</TableCell>

                    <TableCell>
                      {b.start_time ? formatDateTime(b.start_time) : b.starts_at ? formatDateTime(b.starts_at) : "—"}
                    </TableCell>
                    <TableCell>
                      {b.end_time ? formatDateTime(b.end_time) : b.ends_at ? formatDateTime(b.ends_at) : "—"}
                    </TableCell>

                    <TableCell>{b.status || "—"}</TableCell>

                    <TableCell>
                      {b.currency ? `${b.currency} ` : ""}
                      {b.total_amount ?? b.amount ?? "—"}
                    </TableCell>

                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenEdit(b)}>
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography color="text.secondary">No bookings found</Typography>
          )}
        </Paper>

        {/* Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Edit Booking</DialogTitle>

          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Booking: <b>{editBooking?.id}</b>
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                {BOOKING_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={updateBooking.isPending}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </CompanyLayout>
  );
};
