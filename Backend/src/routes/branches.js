const express = require('express');
const router = express.Router({ mergeParams: true });


const BranchService = require('../services/BranchService');
const { authenticate } = require('../middlewares/auth');
const { validateCompany } = require('../middlewares/tenant');
const { success } = require('../utils/response');

// GET /api/companies/:companyId/branches
router.get('/', authenticate, validateCompany, async (req, res, next) => {
  try {
    const branches = await BranchService.list(req.params.companyId);
    return success(res, { branches });
  } catch (err) {
    next(err);
  }
});

// GET /api/companies/:companyId/branches/:branchId
router.get('/:branchId', authenticate, validateCompany, async (req, res, next) => {
  try {
    const branch = await BranchService.getById(req.params.companyId, req.params.branchId);
    return success(res, { branch });
  } catch (err) {
    next(err);
  }
});

// POST /api/companies/:companyId/branches
router.post('/', authenticate, validateCompany, async (req, res, next) => {
  try {
    const branch = await BranchService.create(req.userId, req.params.companyId, req.body);
    return success(res, { branch }, 'Branch created successfully', 201);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/companies/:companyId/branches/:branchId
router.patch('/:branchId', authenticate, validateCompany, async (req, res, next) => {
  try {
    const branch = await BranchService.update(
      req.userId,
      req.params.companyId,
      req.params.branchId,
      req.body
    );
    return success(res, { branch }, 'Branch updated successfully');
  } catch (err) {
    next(err);
  }
});

// DELETE /api/companies/:companyId/branches/:branchId
router.delete('/:branchId', authenticate, validateCompany, async (req, res, next) => {
  try {
    const branch = await BranchService.remove(
      req.userId,
      req.params.companyId,
      req.params.branchId
    );
    return success(res, { branch }, 'Branch deleted successfully');
  } catch (err) {
    next(err);
  }
});


module.exports = router;
