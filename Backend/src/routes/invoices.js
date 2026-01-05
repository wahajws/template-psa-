const express = require('express');
const router = express.Router({ mergeParams: true });
const BaseService = require('../services/BaseService');
const { Invoice, InvoiceItem } = require('../models');
const InvoiceService = new BaseService(Invoice);
const { authenticate } = require('../middlewares/auth');
const { validateCompany } = require('../middlewares/tenant');
const BaseController = require('../controllers/BaseController');
const InvoiceController = new BaseController(InvoiceService);
const { success } = require('../utils/response');

router.use(authenticate);
router.param('companyId', validateCompany);

router.get('/:invoiceId', async (req, res, next) => {
  try {
    const invoice = await InvoiceService.findById(req.params.invoiceId, {
      include: [{
        model: InvoiceItem,
        as: 'items'
      }]
    });
    return success(res, { invoice });
  } catch (err) {
    next(err);
  }
});

module.exports = router;



