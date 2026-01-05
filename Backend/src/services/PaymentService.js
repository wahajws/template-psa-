const BaseService = require('./BaseService');
const { Payment, Invoice, InvoiceItem, Booking } = require('../models');
const { generateUUID } = require('../utils/uuid');
const { NotFoundError } = require('../utils/errors');

class PaymentService extends BaseService {
  constructor() {
    super(Payment);
  }

  async createPaymentIntent(userId, companyId, data) {
    const { booking_id, amount, payment_method } = data;

    const payment = await Payment.create({
      id: generateUUID(),
      user_id: userId,
      company_id: companyId,
      booking_id: booking_id || null,
      amount,
      currency: 'USD',
      payment_method: payment_method || 'credit_card',
      payment_status: 'pending',
      created_by: userId
    });

    return payment;
  }

  async confirmPayment(paymentId, success = true) {
    const payment = await this.findById(paymentId);

    if (success && payment.amount > 0) {
      await payment.update({
        payment_status: 'succeeded',
        paid_at: new Date()
      });

      if (payment.booking_id) {
        const booking = await Booking.findByPk(payment.booking_id);
        if (booking) {
          await booking.update({
            payment_status: 'succeeded',
            booking_status: 'confirmed'
          });
        }
      }
    } else {
      await payment.update({
        payment_status: 'failed',
        failure_reason: 'Payment failed'
      });
    }

    return payment.reload();
  }
}

module.exports = new PaymentService();



