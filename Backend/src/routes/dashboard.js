const express = require('express');
const router = express.Router();

const { authenticate } = require('../middlewares/auth');
const DashboardService = require('../services/DashboardService');

// If you already have RBAC helpers, use them.
// If not, keep only `authenticate` for now and tighten later.
router.use(authenticate);

// Platform (Super Admin)
router.get('/platform', async (req, res, next) => {
  try {
    const data = await DashboardService.platformSummary();
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Company (Company Admin)
router.get('/companies/:companyId', async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const data = await DashboardService.companySummary(companyId);
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Branch (Branch Manager)
router.get('/companies/:companyId/branches/:branchId', async (req, res, next) => {
  try {
    const { companyId, branchId } = req.params;
    const data = await DashboardService.branchSummary(companyId, branchId);
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

module.exports = router;
