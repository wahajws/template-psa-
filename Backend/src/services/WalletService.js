const BaseService = require('./BaseService');
const { CustomerWalletLedger } = require('../models');
const { generateUUID } = require('../utils/uuid');
const { Op } = require('sequelize');

class WalletService extends BaseService {
  constructor() {
    super(CustomerWalletLedger);
  }

  async getBalance(userId, companyId) {
    const ledger = await CustomerWalletLedger.findAll({
      where: {
        user_id: userId,
        company_id: companyId,
        deleted_at: { [Op.is]: null }
      },
      order: [['created_at', 'DESC']],
      limit: 1
    });

    return ledger[0]?.balance_after || 0;
  }

  async getLedger(userId, companyId, options = {}) {
    const { page = 1, pageSize = 50 } = options;

    return this.paginate(page, pageSize, {
      where: {
        user_id: userId,
        company_id: companyId
      },
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = new WalletService();



