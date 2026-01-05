const express = require('express');
const router = express.Router({ mergeParams: true });
const AvailabilityService = require('../services/AvailabilityService');
const { authenticate, optionalAuth } = require('../middlewares/auth');
const { validateCompany, validateBranch } = require('../middlewares/tenant');
const { success } = require('../utils/response');
const { query } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(optionalAuth);
router.param('companyId', validateCompany);
router.param('branchId', validateBranch);

router.get('/', [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601(),
  validate
], async (req, res, next) => {
  try {
    const startDate = req.query.start_date || new Date().toISOString().split('T')[0];
    const endDate = req.query.end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const availability = await AvailabilityService.getBranchAvailability(
      req.params.branchId,
      startDate,
      endDate
    );
    return success(res, availability);
  } catch (err) {
    next(err);
  }
});

module.exports = router;



