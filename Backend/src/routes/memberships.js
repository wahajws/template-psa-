const express = require('express');
const router = express.Router({ mergeParams: true });
const MembershipService = require('../services/MembershipService');
const { authenticate } = require('../middlewares/auth');
const { validateCompany } = require('../middlewares/tenant');
const { success, paginated } = require('../utils/response');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { logActivity } = require('../middlewares/activity');
const Telemetry = require('../utils/telemetry');

router.use(authenticate);
router.param('companyId', validateCompany);

router.post('/purchase', [
  body('membership_plan_id').notEmpty(),
  validate
], async (req, res, next) => {
  try {
    const membership = await MembershipService.purchaseMembership(
      req.userId,
      req.body.membership_plan_id,
      req.companyId,
      req.body
    );
    await logActivity(req, {
      action: 'membership_purchased',
      entity_type: 'membership',
      entity_id: membership.id,
      metadata: { membership_plan_id: req.body.membership_plan_id },
    });
    await Telemetry.track(req, {
      event_name: 'membership.purchase_completed',
      company_id: req.companyId,
      entity_type: 'membership',
      entity_id: membership.id,
      properties: { membership_plan_id: req.body.membership_plan_id },
    });
    return success(res, { membership }, 'Membership purchased successfully', 201);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const memberships = await MembershipService.getUserMemberships(req.userId, req.companyId);
    return success(res, { memberships });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/cancel', [
  body('reason').optional(),
  validate
], async (req, res, next) => {
  try {
    const membership = await MembershipService.cancelMembership(
      req.params.id,
      req.userId,
      req.body.reason
    );
    await logActivity(req, {
      action: 'membership_cancelled',
      entity_type: 'membership',
      entity_id: membership.id,
      metadata: { reason: req.body.reason },
    });
    return success(res, { membership }, 'Membership cancelled successfully');
  } catch (err) {
    next(err);
  }
});

module.exports = router;

