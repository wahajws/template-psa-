const express = require('express');
const router = express.Router({ mergeParams: true });
const BookingController = require('../controllers/BookingController');
const { authenticate } = require('../middlewares/auth');
const { validateCompany, requireCompanySubscription } = require('../middlewares/tenant');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authenticate);
router.param('companyId', validateCompany);
router.use(requireCompanySubscription);

router.post('/', [
  body('branch_id').notEmpty(),
  body('items').isArray({ min: 1 }),
  body('items.*.court_id').notEmpty(),
  body('items.*.service_id').notEmpty(),
  body('items.*.start_datetime').isISO8601(),
  body('items.*.end_datetime').isISO8601(),
  validate
], BookingController.create.bind(BookingController));

router.get('/', BookingController.getAll.bind(BookingController));
router.get('/:bookingId', BookingController.getById.bind(BookingController));
router.post('/:bookingId/cancel', [
  body('reason').optional(),
  validate
], BookingController.cancel.bind(BookingController));

module.exports = router;

