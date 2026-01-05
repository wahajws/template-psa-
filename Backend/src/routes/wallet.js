const express = require('express');
const router = express.Router();
const WalletService = require('../services/WalletService');
const { authenticate } = require('../middlewares/auth');
const { success, paginated } = require('../utils/response');

router.use(authenticate);

router.get('/wallet', async (req, res, next) => {
  try {
    const { company_id } = req.query;
    if (!company_id) {
      return res.status(400).json({ success: false, message: 'company_id required' });
    }
    const balance = await WalletService.getBalance(req.userId, company_id);
    return success(res, { balance });
  } catch (err) {
    next(err);
  }
});

router.get('/wallet/ledger', async (req, res, next) => {
  try {
    const { company_id, page = 1, pageSize = 50 } = req.query;
    if (!company_id) {
      return res.status(400).json({ success: false, message: 'company_id required' });
    }
    const result = await WalletService.getLedger(req.userId, company_id, { page, pageSize });
    return paginated(res, result.data, result.pagination);
  } catch (err) {
    next(err);
  }
});

module.exports = router;



