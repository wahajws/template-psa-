const express = require('express');
const router = express.Router({ mergeParams: true });
const PaymentService = require('../services/PaymentService');
const { authenticate } = require('../middlewares/auth');
const { validateCompany } = require('../middlewares/tenant');
const { success } = require('../utils/response');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { logActivity } = require('../middlewares/activity');
const Telemetry = require('../utils/telemetry');

router.use(authenticate);
router.param('companyId', validateCompany);

router.post('/intent', [
  body('amount').isFloat({ min: 0 }),
  body('payment_method').optional(),
  validate
], async (req, res, next) => {
  try {
    const payment = await PaymentService.createPaymentIntent(
      req.userId,
      req.companyId,
      req.body
    );
    await logActivity(req, {
      action: 'payment_intent_created',
      entity_type: 'payment',
      entity_id: payment.id,
      metadata: { amount: req.body.amount, payment_method: req.body.payment_method },
    });
    return success(res, { payment }, 'Payment intent created', 201);
  } catch (err) {
    next(err);
  }
});

router.post('/confirm', [
  body('payment_id').notEmpty(),
  body('success').optional().isBoolean(),
  validate
], async (req, res, next) => {
  try {
    const payment = await PaymentService.confirmPayment(
      req.body.payment_id,
      req.body.success !== false
    );
    await logActivity(req, {
      action: 'payment_confirmed',
      entity_type: 'payment',
      entity_id: payment.id,
      metadata: { success: req.body.success !== false },
    });
    await Telemetry.track(req, {
      event_name: 'payment.confirmed',
      company_id: req.companyId,
      entity_type: 'payment',
      entity_id: payment.id,
      properties: { success: req.body.success !== false, amount: payment.amount },
    });
    return success(res, { payment }, 'Payment confirmed');
  } catch (err) {
    next(err);
  }
});

router.get('/:paymentId', async (req, res, next) => {
  try {
    const payment = await PaymentService.findById(req.params.paymentId);
    return success(res, { payment });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


