// src/pages/company/CampaignsPage.js
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

import { CompanyLayout } from "../../components/layouts/CompanyLayout";
import { Loading } from "../../components/common/Loading";
import { useToast } from "../../components/common/Toast";
import { useApiQuery, useApiMutation, useApiUpdate, useApiDelete } from "../../hooks/useQuery";
import { API_ENDPOINTS } from "../../config/api";
import { formatDateTime } from "../../utils/format";


const DISCOUNT_TYPES = ["percent_off", "fixed_amount_off"];
const APPLICABILITY_OPTIONS = [
  "all",
  "services",
  "membership_plans",
  "courts",
];

export const CampaignsPage = () => {
  const { companyId } = useParams();
  const { showToast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    discount_type: "percent_off",
    discount_value: "",
    applicability: "all",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  // -----------------------------
  // Endpoints (same fallback style)
  // -----------------------------
  const listEndpoint =
    API_ENDPOINTS.CAMPAIGNS?.LIST
      ? API_ENDPOINTS.CAMPAIGNS.LIST(companyId)
      : API_ENDPOINTS.ADMIN?.COMPANY?.CAMPAIGNS
      ? API_ENDPOINTS.ADMIN.COMPANY.CAMPAIGNS(companyId)
      : `/admin/companies/${companyId}/campaigns`;

  const createEndpoint =
    API_ENDPOINTS.CAMPAIGNS?.CREATE
      ? API_ENDPOINTS.CAMPAIGNS.CREATE(companyId)
      : listEndpoint;

  const updateEndpoint = (id) =>
    API_ENDPOINTS.CAMPAIGNS?.UPDATE
      ? API_ENDPOINTS.CAMPAIGNS.UPDATE(companyId, id)
      : `${listEndpoint}/${id}`;

  const deleteEndpoint = (id) =>
    API_ENDPOINTS.CAMPAIGNS?.DELETE
      ? API_ENDPOINTS.CAMPAIGNS.DELETE(companyId, id)
      : `${listEndpoint}/${id}`;

  // -----------------------------
  // Query
  // -----------------------------
  const { data, isLoading, error, refetch } = useApiQuery(
    ["company", "campaigns", companyId],
    listEndpoint,
    { enabled: !!companyId }
  );

  // handle multiple response shapes
  const campaigns = useMemo(() => {
    if (Array.isArray(data?.data?.campaigns)) return data.data.campaigns;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  // -----------------------------
  // Mutations
  // -----------------------------
  const createCampaign = useApiMutation(createEndpoint, {
    onSuccess: () => {
      showToast("Campaign created successfully", "success");
      setOpenDialog(false);
      refetch();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create campaign";
      showToast(msg, "error");
    },
  });

  const updateCampaign = useApiUpdate((id) => updateEndpoint(id), {
    onSuccess: () => {
      showToast("Campaign updated successfully", "success");
      setOpenDialog(false);
      setEditCampaign(null);
      refetch();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update campaign";
      showToast(msg, "error");
    },
  });

  const deleteCampaign = useApiDelete((id) => deleteEndpoint(id), {
    onSuccess: () => {
      showToast("Campaign deleted successfully", "success");
      refetch();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete campaign";
      showToast(msg, "error");
    },
  });

  // -----------------------------
  // Dialog handlers
  // -----------------------------
  const resetForm = () => {
    setFormValues({
      name: "",
      description: "",
      discount_type: "percent_off",
      discount_value: "",
      applicability: "all",
      start_date: "",
      end_date: "",
      is_active: true,
    });
  };

  const handleOpenDialog = (campaign = null) => {
    if (campaign) {
      setEditCampaign(campaign);
      setFormValues({
        name: campaign.name || "",
        description: campaign.description || "",
        discount_type: campaign.discount_type || "percent_off",
        discount_value: campaign.discount_value ?? "",
        applicability: campaign.applicability || "all",
        start_date: campaign.start_date ? String(campaign.start_date).slice(0, 10) : "",
        end_date: campaign.end_date ? String(campaign.end_date).slice(0, 10) : "",
        is_active: campaign.is_active ?? true,
      });
    } else {
      setEditCampaign(null);
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!companyId) {
      showToast("companyId missing in URL", "error");
      return;
    }

    // required fields based on your validation screenshot
    if (!formValues.name) return showToast("Name is required", "error");
    if (!formValues.discount_type) return showToast("Discount type is required", "error");
    if (formValues.discount_value === "" || formValues.discount_value === null)
      return showToast("Discount value is required", "error");
    if (!formValues.applicability) return showToast("Applicability is required", "error");
    if (!formValues.start_date) return showToast("Start date is required", "error");
    if (!formValues.end_date) return showToast("End date is required", "error");

    // ✅ ensure discount_type is valid (prevents "Data truncated")
    if (!DISCOUNT_TYPES.includes(formValues.discount_type)) {
      showToast(`Invalid discount type. Use: ${DISCOUNT_TYPES.join(", ")}`, "error");
      return;
    }

    const payload = {
      name: formValues.name,
      description: formValues.description || null,
      discount_type: formValues.discount_type, // ✅ enum-safe
      discount_value: Number(formValues.discount_value),
      applicability: formValues.applicability,
      start_date: formValues.start_date,
      end_date: formValues.end_date,
      is_active: !!formValues.is_active,
    };

    if (editCampaign) {
      await updateCampaign.mutateAsync({ id: editCampaign.id, data: payload });
    } else {
      await createCampaign.mutateAsync(payload);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      await deleteCampaign.mutateAsync(id);
    }
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
            {error?.response?.data?.message || "Failed to load campaigns"}
          </Alert>
        </Container>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Campaigns</Typography>
          <Button startIcon={<Add />} variant="contained" onClick={() => handleOpenDialog()}>
            Add Campaign
          </Button>
        </Box>

        <Paper sx={{ p: 2 }}>
          {campaigns.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Discount Type</TableCell>
                  <TableCell>Discount Value</TableCell>
                  <TableCell>Applicability</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.discount_type}</TableCell>
                    <TableCell>{c.discount_value}</TableCell>
                    <TableCell>{c.applicability}</TableCell>
                    <TableCell>{c.start_date ? String(c.start_date).slice(0, 10) : "—"}</TableCell>
                    <TableCell>{c.end_date ? String(c.end_date).slice(0, 10) : "—"}</TableCell>
                    <TableCell>{c.is_active ? "Yes" : "No"}</TableCell>
                    <TableCell>{c.created_at ? formatDateTime(c.created_at) : "—"}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenDialog(c)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(c.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography color="text.secondary">No campaigns found</Typography>
          )}
        </Paper>

        {/* Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editCampaign ? "Edit Campaign" : "Add New Campaign"}</DialogTitle>

          <DialogContent>
            <TextField
              label="Campaign Name"
              fullWidth
              margin="normal"
              value={formValues.name}
              onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
            />

            <TextField
              label="Description"
              fullWidth
              margin="normal"
              multiline
              minRows={2}
              value={formValues.description}
              onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
            />

            {/* ✅ FIX: discount_type must be enum-safe */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Discount Type</InputLabel>
              <Select
                label="Discount Type"
                value={formValues.discount_type}
                onChange={(e) =>
                  setFormValues({ ...formValues, discount_type: e.target.value })
                }
              >
                {DISCOUNT_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Discount Value"
              type="number"
              fullWidth
              margin="normal"
              value={formValues.discount_value}
              onChange={(e) =>
                setFormValues({ ...formValues, discount_value: e.target.value })
              }
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Applicability</InputLabel>
              <Select
                label="Applicability"
                value={formValues.applicability}
                onChange={(e) =>
                  setFormValues({ ...formValues, applicability: e.target.value })
                }
              >
                {APPLICABILITY_OPTIONS.map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formValues.start_date}
              onChange={(e) =>
                setFormValues({ ...formValues, start_date: e.target.value })
              }
            />

            <TextField
              label="End Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formValues.end_date}
              onChange={(e) =>
                setFormValues({ ...formValues, end_date: e.target.value })
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={!!formValues.is_active}
                  onChange={(e) =>
                    setFormValues({ ...formValues, is_active: e.target.checked })
                  }
                />
              }
              label="Active"
              sx={{ mt: 1 }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={createCampaign.isPending || updateCampaign.isPending}
            >
              {editCampaign ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </CompanyLayout>
  );
};
