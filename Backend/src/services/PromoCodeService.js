const { PromoCode, Campaign, DiscountApplication } = require('../models');
const { Op } = require('sequelize');
const { NotFoundError, ValidationError } = require('../utils/errors');

class PromoCodeService {
  async validatePromoCode(companyId, code, userId, amount = null) {
    const promoCode = await PromoCode.findOne({
      where: {
        company_id: companyId,
        code,
        is_active: true,
        deleted_at: null
      },
      include: [{
        model: Campaign,
        as: 'campaign',
        where: {
          is_active: true,
          start_date: { [Op.lte]: new Date() },
          end_date: { [Op.gte]: new Date() },
          deleted_at: null
        }
      }]
    });

    if (!promoCode || !promoCode.campaign) {
      throw new NotFoundError('Promo code');
    }

    const campaign = promoCode.campaign;

    if (campaign.total_usage_limit && campaign.current_usage_count >= campaign.total_usage_limit) {
      throw new ValidationError('Promo code usage limit reached');
    }

    if (campaign.usage_limit_per_user) {
      const userUsage = await DiscountApplication.count({
        where: {
          campaign_id: campaign.id,
          user_id: userId,
          deleted_at: null
        }
      });

      if (userUsage >= campaign.usage_limit_per_user) {
        throw new ValidationError('Promo code usage limit per user reached');
      }
    }

    if (amount && campaign.min_purchase_amount && amount < campaign.min_purchase_amount) {
      throw new ValidationError(`Minimum purchase amount: ${campaign.min_purchase_amount}`);
    }

    let discountAmount = 0;
    if (campaign.discount_type === 'percent_off') {
      discountAmount = (amount * campaign.discount_value) / 100;
      if (campaign.max_discount_amount) {
        discountAmount = Math.min(discountAmount, campaign.max_discount_amount);
      }
    } else {
      discountAmount = campaign.discount_value;
    }

    return {
      valid: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        discount_type: campaign.discount_type,
        discount_value: campaign.discount_value
      },
      discount_amount: discountAmount
    };
  }
}

module.exports = new PromoCodeService();



