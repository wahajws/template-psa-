const express = require('express');
const router = express.Router({ mergeParams: true });
const RefundService = require('../services/RefundService');
const { authenticate } = require('../middlewares/auth');
const { validateCompany } = require('../middlewares/tenant');
const { requireCompanyAdmin } = require('../middlewares/rbac');
const { success } = require('../utils/response');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { logActivity } = require('../middlewares/activity');

router.use(authenticate);
router.param('companyId', validateCompany);
router.use(requireCompanyAdmin);

router.post('/', [
  body('payment_id').notEmpty(),
  body('amount').optional().isFloat({ min: 0.01 }),
  body('reason').optional(),
  body('refund_to_wallet').optional().isBoolean(),
  validate
], async (req, res, next) => {
  try {
    const refund = await RefundService.createRefund(
      req.body.payment_id,
      req.companyId,
      req.userId,
      req.body
    );
    await logActivity(req, {
      action: 'refund_created',
      entity_type: 'payment',
      entity_id: req.body.payment_id,
      metadata: { refund_id: refund.id, amount: req.body.amount, reason: req.body.reason },
    });
    return success(res, { refund }, 'Refund created successfully', 201);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

