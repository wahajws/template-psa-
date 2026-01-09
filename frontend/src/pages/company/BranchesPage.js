import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

import { CompanyLayout } from "../../components/layouts/CompanyLayout";
import { useApiQuery, useApiMutation, useApiUpdate, useApiDelete } from "../../hooks/useQuery";
import { API_ENDPOINTS } from "../../config/api";
import { Loading } from "../../components/common/Loading";
import { useToast } from "../../components/common/Toast";
import { formatDateTime } from "../../utils/format";

const slugify = (s = "") =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  latitude: "",
  longitude: "",
  timezone: "UTC",
};

export const BranchesPage = () => {
  const { companyId } = useParams();
  const { showToast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);

  // --- Fetch branches
  const { data: branchesData, isLoading, refetch, error } = useApiQuery(
    ["company", "branches", companyId],
    API_ENDPOINTS.BRANCHES.LIST(companyId),
    { enabled: !!companyId }
  );

  const branches = useMemo(() => {
    return Array.isArray(branchesData?.data?.branches) ? branchesData.data.branches : [];
  }, [branchesData]);

  // --- CREATE
  const createBranch = useApiMutation(API_ENDPOINTS.BRANCHES.CREATE(companyId), {
    onSuccess: () => {
      showToast("Branch created successfully", "success");
      setOpenDialog(false);
      setEditBranch(null);
      setFormValues(emptyForm);
      refetch();
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to create branch";
      showToast(msg, "error");
    },
  });

  // --- UPDATE (your hook uses PATCH)
  const updateBranch = useApiUpdate(
    (id) => API_ENDPOINTS.BRANCHES.UPDATE(companyId, id),
    {
      onSuccess: () => {
        showToast("Branch updated successfully", "success");
        setOpenDialog(false);
        setEditBranch(null);
        setFormValues(emptyForm);
        refetch();
      },
      onError: (err) => {
        const msg = err?.response?.data?.message || "Failed to update branch";
        showToast(msg, "error");
      },
    }
  );

  // --- DELETE
  const deleteBranch = useApiDelete(
    (id) => API_ENDPOINTS.BRANCHES.DELETE(companyId, id),
    {
      onSuccess: () => {
        showToast("Branch deleted successfully", "success");
        refetch();
      },
      onError: (err) => {
        const msg = err?.response?.data?.message || "Failed to delete branch";
        showToast(msg, "error");
      },
    }
  );

  const handleOpenDialog = (branch = null) => {
    if (branch) {
      setEditBranch(branch);
      setFormValues({
        name: branch.name || "",
        slug: branch.slug || "",
        description: branch.description || "",
        address_line1: branch.address_line1 || "",
        address_line2: branch.address_line2 || "",
        city: branch.city || "",
        state: branch.state || "",
        postal_code: branch.postal_code || "",
        country: branch.country || "",
        latitude: branch.latitude ?? "",
        longitude: branch.longitude ?? "",
        timezone: branch.timezone || "UTC",
      });
    } else {
      setEditBranch(null);
      setFormValues(emptyForm);
    }
    setOpenDialog(true);
  };

  const handleChange = (field) => (e) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    if (!companyId) {
      showToast("companyId missing in URL", "error");
      return;
    }

    // ✅ Build payload required by backend model
    const payload = {
      ...formValues,
      slug: formValues.slug ? slugify(formValues.slug) : slugify(formValues.name),
      latitude: formValues.latitude === "" ? "" : Number(formValues.latitude),
      longitude: formValues.longitude === "" ? "" : Number(formValues.longitude),
    };

    // Basic frontend validation (to avoid backend VALIDATION_ERROR)
    const required = ["name", "slug", "address_line1", "city", "country", "latitude", "longitude"];
    const missing = required.filter((k) => payload[k] === "" || payload[k] === null || payload[k] === undefined);

    if (missing.length) {
      showToast(`Missing fields: ${missing.join(", ")}`, "error");
      return;
    }

    if (Number.isNaN(payload.latitude) || Number.isNaN(payload.longitude)) {
      showToast("Latitude/Longitude must be numbers", "error");
      return;
    }

    if (editBranch) {
      await updateBranch.mutateAsync({ id: editBranch.id, data: payload });
    } else {
      // ✅ IMPORTANT: your useApiMutation expects ONLY data object
      await createBranch.mutateAsync(payload);
    }
  };

  const handleDelete = async (branchId) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      await deleteBranch.mutateAsync(branchId);
    }
  };

  if (isLoading) {
    return (
      <CompanyLayout>
        <Loading />
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Branches</Typography>
          <Button startIcon={<Add />} variant="contained" onClick={() => handleOpenDialog()}>
            Add Branch
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.response?.data?.message || "Failed to load branches"}
          </Alert>
        )}

        <Paper sx={{ p: 2 }}>
          {branches.length ? (
            <List dense>
              {branches.map((b, idx) => (
                <React.Fragment key={b.id}>
                  <ListItem
                    secondaryAction={
                      <>
                        <IconButton color="primary" onClick={() => handleOpenDialog(b)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(b.id)}>
                          <Delete />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={b.name}
                      secondary={
                        <Box component="span">
                          {b.slug ? `Slug: ${b.slug} • ` : ""}
                          {b.created_at ? formatDateTime(b.created_at) : ""}
                        </Box>
                      }
                    />
                  </ListItem>
                  {idx < branches.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No branches found</Typography>
          )}
        </Paper>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editBranch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
          <DialogContent>
            <TextField label="Branch Name *" fullWidth margin="normal" value={formValues.name} onChange={handleChange("name")} />
            <TextField label="Slug * (auto if empty)" fullWidth margin="normal" value={formValues.slug} onChange={handleChange("slug")} />
            <TextField label="Description" fullWidth margin="normal" value={formValues.description} onChange={handleChange("description")} />

            <TextField label="Address Line 1 *" fullWidth margin="normal" value={formValues.address_line1} onChange={handleChange("address_line1")} />
            <TextField label="Address Line 2" fullWidth margin="normal" value={formValues.address_line2} onChange={handleChange("address_line2")} />

            <TextField label="City *" fullWidth margin="normal" value={formValues.city} onChange={handleChange("city")} />
            <TextField label="State" fullWidth margin="normal" value={formValues.state} onChange={handleChange("state")} />
            <TextField label="Postal Code" fullWidth margin="normal" value={formValues.postal_code} onChange={handleChange("postal_code")} />
            <TextField label="Country *" fullWidth margin="normal" value={formValues.country} onChange={handleChange("country")} />

            <TextField label="Latitude *" fullWidth margin="normal" value={formValues.latitude} onChange={handleChange("latitude")} />
            <TextField label="Longitude *" fullWidth margin="normal" value={formValues.longitude} onChange={handleChange("longitude")} />

            <TextField label="Timezone" fullWidth margin="normal" value={formValues.timezone} onChange={handleChange("timezone")} />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={createBranch.isPending || updateBranch.isPending}
            >
              {editBranch ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </CompanyLayout>
  );
};
