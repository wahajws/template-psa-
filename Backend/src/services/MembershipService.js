const BaseService = require('./BaseService');
const { CustomerMembership, MembershipPlan, MembershipCycle } = require('../models');
const { generateUUID } = require('../utils/uuid');
const { ConflictError } = require('../utils/errors');
const { Op } = require('sequelize');

class MembershipService extends BaseService {
  constructor() {
    super(CustomerMembership);
  }

  async purchaseMembership(userId, membershipPlanId, companyId, data = {}) {
    const plan = await MembershipPlan.findByPk(membershipPlanId);
    if (!plan || !plan.is_active) {
      throw new ConflictError('Membership plan not available');
    }

    const existing = await CustomerMembership.findOne({
      where: {
        user_id: userId,
        membership_plan_id: membershipPlanId,
        status: { [Op.in]: ['active', 'trialing'] },
        deleted_at: { [Op.is]: null }
      }
    });

    if (existing && plan.max_active_per_user === 1) {
      throw new ConflictError('Already have an active membership for this plan');
    }

    const startDate = new Date();
    const endDate = plan.billing_type === 'annual' 
      ? new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate())
      : new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());

    const membership = await CustomerMembership.create({
      id: generateUUID(),
      user_id: userId,
      membership_plan_id: membershipPlanId,
      company_id: companyId,
      branch_id: plan.plan_scope === 'branch_specific' ? plan.branch_id : null,
      status: 'active',
      start_date: startDate,
      end_date: endDate,
      auto_renew: data.auto_renew !== false,
      next_billing_date: endDate,
      created_by: userId
    });

    return membership;
  }

  async cancelMembership(membershipId, userId, reason) {
    const membership = await this.findById(membershipId);
    
    if (membership.user_id !== userId) {
      throw new ConflictError('Not authorized');
    }

    await membership.update({
      status: 'cancelled',
      cancelled_at: new Date(),
      cancelled_by: userId,
      cancellation_reason: reason,
      auto_renew: false
    });

    return membership.reload();
  }

  async getUserMemberships(userId, companyId = null) {
    const where = {
      user_id: userId,
      deleted_at: { [Op.is]: null }
    };
    
    if (companyId) {
      where.company_id = companyId;
    }
    
    return CustomerMembership.findAll({
      where,
      include: [{
        model: MembershipPlan,
        as: 'plan'
      }],
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = new MembershipService();

