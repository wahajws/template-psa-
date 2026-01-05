const express = require('express');
const router = express.Router();
const CompanyCustomerService = require('../services/CompanyCustomerService');
const { authenticate } = require('../middlewares/auth');
const { validateCompany } = require('../middlewares/tenant');
const { success } = require('../utils/response');

router.post('/:companyId/subscribe', authenticate, validateCompany, async (req, res, next) => {
  try {
    const subscription = await CompanyCustomerService.subscribe(req.userId, req.params.companyId, req.body);
    return success(res, { subscription }, 'Subscribed successfully', 201);
  } catch (err) {
    next(err);
  }
});

router.delete('/:companyId/subscribe', authenticate, validateCompany, async (req, res, next) => {
  try {
    const subscription = await CompanyCustomerService.unsubscribe(req.userId, req.params.companyId);
    return success(res, { subscription }, 'Unsubscribed successfully');
  } catch (err) {
    next(err);
  }
});

router.get('/me/companies', authenticate, async (req, res, next) => {
  try {
    const companies = await CompanyCustomerService.getUserCompanies(req.userId);
    return success(res, { companies });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

