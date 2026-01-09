import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

import { BranchLayout } from "../../components/layouts/BranchLayout";
import { Loading } from "../../components/common/Loading";
import { useToast } from "../../components/common/Toast";
import { useApiQuery, useApiMutation, useApiUpdate, useApiDelete } from "../../hooks/useQuery";
import { API_ENDPOINTS } from "../../config/api";
import { formatDateTime } from "../../utils/format";

export const BranchMembershipsPage = () => {
  const { companyId, branchId } = useParams();
  const { showToast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formValues, setFormValues] = useState({
    user_id: "",
    membership_plan_id: "",
    status: "active",
    start_date: "",
    end_date: "",
  });

  // Endpoints
  const baseEndpoint = `/companies/${companyId}/branches/${branchId}/memberships`;
  const listEndpoint = API_ENDPOINTS?.BRANCH?.MEMBERSHIPS?.LIST?.(companyId, branchId) || baseEndpoint;
  const createEndpoint = API_ENDPOINTS?.BRANCH?.MEMBERSHIPS?.CREATE?.(companyId, branchId) || baseEndpoint;
  const updateEndpoint = (id) =>
    API_ENDPOINTS?.BRANCH?.MEMBERSHIPS?.UPDATE?.(companyId, branchId, id) ||
    `${baseEndpoint}/${id}`;
  const deleteEndpoint = (id) =>
    API_ENDPOINTS?.BRANCH?.MEMBERSHIPS?.DELETE?.(companyId, branchId, id) ||
    `${baseEndpoint}/${id}`;

  const plansEndpoint =
    API_ENDPOINTS.MEMBERSHIP_PLANS?.LIST?.(companyId) ||
    `/admin/companies/${companyId}/membership-plans`;

  // Queries
  const { data: membershipsRes, isLoading, error, refetch } = useApiQuery(
    ["branch", "memberships", companyId, branchId],
    listEndpoint,
    { enabled: !!companyId && !!branchId }
  );

  const { data: plansRes } = useApiQuery(["plans", companyId], plansEndpoint, {
    enabled: !!plansEndpoint,
  });

  const createMembership = useApiMutation(createEndpoint, {
    onSuccess: () => {
      showToast("Membership created successfully", "success");
      setOpenDialog(false);
      refetch();
    },
    onError: (err) => {
      showToast(err?.response?.data?.message || "Failed to create membership", "error");
    },
  });

  const updateMembership = useApiUpdate((id) => updateEndpoint(id), {
    onSuccess: () => {
      showToast("Membership updated successfully", "success");
      setOpenDialog(false);
      setEditItem(null);
      refetch();
    },
    onError: (err) => {
      showToast(err?.response?.data?.message || "Failed to update membership", "error");
    },
  });

  const deleteMembership = useApiDelete((id) => deleteEndpoint(id), {
    onSuccess: () => {
      showToast("Membership deleted", "success");
      refetch();
    },
    onError: (err) => {
      showToast(err?.response?.data?.message || "Failed to delete membership", "error");
    },
  });

  // Derived
  const memberships =
    membershipsRes?.data?.memberships || membershipsRes?.data || membershipsRes || [];

  const plans =
    plansRes?.data?.membership_plans || plansRes?.data?.plans || plansRes?.data || [];

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormValues({
        user_id: item.user_id || "",
        membership_plan_id: item.membership_plan_id || "",
        status: item.status || "active",
        start_date: item.start_date || "",
        end_date: item.end_date || "",
      });
    } else {
      setEditItem(null);
      setFormValues({
        user_id: "",
        membership_plan_id: "",
        status: "active",
        start_date: "",
        end_date: "",
      });
    }
    setOpenDialog(true);
  };

  const handleSave = async () => {
    const payload = { ...formValues, branch_id: branchId };
    if (editItem) {
      await updateMembership.mutateAsync({ id: editItem.id, data: payload });
    } else {
      await createMembership.mutateAsync(payload);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this membership?")) await deleteMembership.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <BranchLayout>
        <Loading />
      </BranchLayout>
    );
  }

  return (
    <BranchLayout>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Branch Memberships</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Add Membership
          </Button>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.response?.data?.message || "Failed to load memberships"}
          </Alert>
        ) : null}

        <Paper sx={{ p: 2 }}>
          {Array.isArray(memberships) && memberships.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {memberships.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.user_name || m.user_id}</TableCell>
                    <TableCell>{m.plan_name || m.membership_plan_id}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={m.status}
                        color={
                          m.status === "active"
                            ? "success"
                            : m.status === "pending"
                            ? "warning"
                            : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>{m.start_date ? formatDateTime(m.start_date) : "—"}</TableCell>
                    <TableCell>{m.end_date ? formatDateTime(m.end_date) : "—"}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenDialog(m)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(m.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography sx={{ p: 2 }} color="text.secondary">
              No memberships found
            </Typography>
          )}
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editItem ? "Edit Membership" : "Add Membership"}</DialogTitle>
          <DialogContent>
            <TextField
              label="User ID"
              fullWidth
              margin="normal"
              value={formValues.user_id}
              onChange={(e) => setFormValues({ ...formValues, user_id: e.target.value })}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Plan</InputLabel>
              <Select
                label="Plan"
                value={formValues.membership_plan_id}
                onChange={(e) => setFormValues({ ...formValues, membership_plan_id: e.target.value })}
              >
                {plans.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={formValues.status}
                onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formValues.start_date}
              onChange={(e) => setFormValues({ ...formValues, start_date: e.target.value })}
            />

            <TextField
              label="End Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formValues.end_date}
              onChange={(e) => setFormValues({ ...formValues, end_date: e.target.value })}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              {editItem ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </BranchLayout>
  );
};
