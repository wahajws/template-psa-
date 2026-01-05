const express = require('express');
const router = express.Router({ mergeParams: true });
const PromoCodeService = require('../services/PromoCodeService');
const { authenticate, optionalAuth } = require('../middlewares/auth');
const { validateCompany } = require('../middlewares/tenant');
const { success } = require('../utils/response');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { logActivity } = require('../middlewares/activity');

router.use(optionalAuth);
router.param('companyId', validateCompany);

router.post('/validate', [
  body('code').notEmpty(),
  body('amount').optional().isFloat({ min: 0 }),
  validate
], async (req, res, next) => {
  try {
    const result = await PromoCodeService.validatePromoCode(
      req.params.companyId,
      req.body.code,
      req.userId || null,
      req.body.amount
    );
    if (result.valid) {
      await logActivity(req, {
        action: 'promo_validated',
        entity_type: 'promo',
        entity_id: result.promoCode?.id || null,
        metadata: { code: req.body.code, discount_amount: result.discount_amount },
      });
    }
    return success(res, result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;


