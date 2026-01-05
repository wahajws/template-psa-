const BaseService = require('./BaseService');
const { Refund, Payment, CustomerWalletLedger } = require('../models');
const { generateUUID } = require('../utils/uuid');
const { NotFoundError, ValidationError } = require('../utils/errors');

class RefundService extends BaseService {
  constructor() {
    super(Refund);
  }

  async createRefund(paymentId, companyId, userId, data) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment || payment.company_id !== companyId) {
      throw new NotFoundError('Payment');
    }

    if (payment.payment_status !== 'succeeded') {
      throw new ValidationError('Can only refund succeeded payments');
    }

    const refundAmount = data.amount || payment.amount;

    if (refundAmount > payment.amount) {
      throw new ValidationError('Refund amount cannot exceed payment amount');
    }

    const refund = await Refund.create({
      id: generateUUID(),
      payment_id: paymentId,
      company_id: companyId,
      amount: refundAmount,
      currency: payment.currency,
      refund_status: 'pending',
      reason: data.reason,
      created_by: userId
    });

    if (data.refund_to_wallet) {
      await CustomerWalletLedger.create({
        id: generateUUID(),
        user_id: payment.user_id,
        company_id: companyId,
        transaction_type: 'credit',
        amount: refundAmount,
        balance_after: refundAmount,
        reference_type: 'refund',
        reference_id: refund.id,
        description: `Refund for payment ${paymentId}`,
        created_by: userId
      });
    }

    await refund.update({ refund_status: 'completed', processed_at: new Date() });
    await payment.update({ payment_status: refundAmount === payment.amount ? 'refunded' : 'partially_refunded' });

    return refund.reload();
  }
}

module.exports = new RefundService();



