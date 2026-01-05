const BaseService = require('./BaseService');
const { GiftCard, GiftCardRedemption, CustomerWalletLedger } = require('../models');
const { generateUUID } = require('../utils/uuid');
const { NotFoundError, ConflictError } = require('../utils/errors');
const { Op } = require('sequelize');

class GiftCardService extends BaseService {
  constructor() {
    super(GiftCard);
  }

  async purchaseGiftCard(userId, companyId, data) {
    const { amount, assigned_to_user_id, expires_at } = data;
    const code = `GC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const giftCard = await GiftCard.create({
      id: generateUUID(),
      company_id: companyId,
      code,
      initial_amount: amount,
      current_balance: amount,
      currency: 'USD',
      status: 'active',
      expires_at: expires_at ? new Date(expires_at) : null,
      purchased_by_user_id: userId,
      assigned_to_user_id: assigned_to_user_id || null,
      created_by: userId
    });

    return giftCard;
  }

  async redeemGiftCard(userId, companyId, code, bookingId = null) {
    const giftCard = await GiftCard.findOne({
      where: {
        code,
        company_id: companyId,
        status: 'active',
        deleted_at: { [Op.is]: null }
      }
    });

    if (!giftCard) {
      throw new NotFoundError('Gift card');
    }

    if (giftCard.current_balance <= 0) {
      throw new ConflictError('Gift card has no balance');
    }

    if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
      throw new ConflictError('Gift card has expired');
    }

    const amount = giftCard.current_balance;
    const newBalance = 0;

    await giftCard.update({
      current_balance: newBalance,
      status: newBalance <= 0 ? 'redeemed' : 'active'
    });

    const walletEntry = await CustomerWalletLedger.create({
      id: generateUUID(),
      user_id: userId,
      company_id: companyId,
      transaction_type: 'credit',
      amount,
      balance_after: amount,
      reference_type: 'gift_card',
      reference_id: giftCard.id,
      description: `Gift card redemption: ${code}`,
      created_by: userId
    });

    await GiftCardRedemption.create({
      id: generateUUID(),
      gift_card_id: giftCard.id,
      wallet_ledger_id: walletEntry.id,
      booking_id: bookingId,
      amount_used: amount,
      created_by: userId
    });

    return { giftCard, walletEntry };
  }
}

module.exports = new GiftCardService();



