const express = require('express');
const router = express.Router({ mergeParams: true });
const GiftCardService = require('../services/GiftCardService');
const { authenticate } = require('../middlewares/auth');
const { validateCompany } = require('../middlewares/tenant');
const { success } = require('../utils/response');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { logActivity } = require('../middlewares/activity');
const Telemetry = require('../utils/telemetry');

router.use(authenticate);
router.param('companyId', validateCompany);

router.post('/purchase', [
  body('amount').isFloat({ min: 0.01 }),
  body('assigned_to_user_id').optional(),
  body('expires_at').optional().isISO8601(),
  validate
], async (req, res, next) => {
  try {
    const giftCard = await GiftCardService.purchaseGiftCard(
      req.userId,
      req.companyId,
      req.body
    );
    await logActivity(req, {
      action: 'gift_card_purchased',
      entity_type: 'gift_card',
      entity_id: giftCard.id,
      metadata: { amount: req.body.amount },
    });
    return success(res, { giftCard }, 'Gift card purchased successfully', 201);
  } catch (err) {
    next(err);
  }
});

router.post('/redeem', [
  body('code').notEmpty(),
  body('booking_id').optional(),
  validate
], async (req, res, next) => {
  try {
    const result = await GiftCardService.redeemGiftCard(
      req.userId,
      req.companyId,
      req.body.code,
      req.body.booking_id
    );
    await logActivity(req, {
      action: 'gift_card_redeemed',
      entity_type: 'gift_card',
      entity_id: result.giftCard?.id || null,
      metadata: { booking_id: req.body.booking_id },
    });
    await Telemetry.track(req, {
      event_name: 'booking.giftcard_applied',
      company_id: req.companyId,
      entity_type: 'gift_card',
      entity_id: result.giftCard?.id || null,
      properties: { booking_id: req.body.booking_id, amount: result.amount_used },
    });
    return success(res, result, 'Gift card redeemed successfully');
  } catch (err) {
    next(err);
  }
});

router.get('/me/gift-cards', async (req, res, next) => {
  try {
    const giftCards = await GiftCardService.findAll({
      where: {
        assigned_to_user_id: req.userId,
        status: 'active'
      }
    });
    return success(res, { giftCards });
  } catch (err) {
    next(err);
  }
});

router.get('/:giftCardId', async (req, res, next) => {
  try {
    const giftCard = await GiftCardService.findById(req.params.giftCardId);
    return success(res, { giftCard });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


