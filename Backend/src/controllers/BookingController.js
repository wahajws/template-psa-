const BookingService = require('../services/BookingService');
const { success, paginated } = require('../utils/response');
const { logActivity } = require('../middlewares/activity');
const Telemetry = require('../utils/telemetry');

class BookingController {
  async create(req, res, next) {
    try {
      const booking = await BookingService.createBooking({
        ...req.body,
        company_id: req.companyId
      }, req.userId);
      await logActivity(req, {
        action: 'booking_created',
        entity_type: 'booking',
        entity_id: booking.id,
        metadata: { branch_id: booking.branch_id, court_id: req.body.court_id },
      });
      await Telemetry.track(req, {
        event_name: 'booking.confirmed',
        company_id: req.companyId,
        branch_id: booking.branch_id,
        entity_type: 'booking',
        entity_id: booking.id,
        properties: { court_id: req.body.court_id, status: booking.status },
      });
      return success(res, { booking }, 'Booking created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const result = await BookingService.paginate(
        parseInt(page),
        parseInt(pageSize),
        {
          where: {
            company_id: req.companyId,
            user_id: req.userId
          },
          include: ['items', 'participants']
        }
      );
      return paginated(res, result.data, result.pagination);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const booking = await BookingService.findById(req.params.bookingId, {
        include: ['items', 'participants']
      });
      return success(res, { booking });
    } catch (err) {
      next(err);
    }
  }

  async cancel(req, res, next) {
    try {
      const booking = await BookingService.cancelBooking(
        req.params.bookingId,
        req.userId,
        req.body.reason
      );
      await logActivity(req, {
        action: 'booking_cancelled',
        entity_type: 'booking',
        entity_id: booking.id,
        metadata: { reason: req.body.reason },
      });
      await Telemetry.track(req, {
        event_name: 'booking.cancelled',
        company_id: req.companyId,
        branch_id: booking.branch_id,
        entity_type: 'booking',
        entity_id: booking.id,
        properties: { reason: req.body.reason },
      });
      return success(res, { booking }, 'Booking cancelled successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BookingController();


