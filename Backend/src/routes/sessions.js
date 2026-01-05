const express = require('express');
const router = express.Router();
const { AuthSession } = require('../models');
const { authenticate } = require('../middlewares/auth');
const { success } = require('../utils/response');
const { Op } = require('sequelize');

router.use(authenticate);

router.get('/sessions', async (req, res, next) => {
  try {
    const sessions = await AuthSession.findAll({
      where: {
        user_id: req.userId,
        deleted_at: null
      },
      order: [['created_at', 'DESC']]
    });
    return success(res, { sessions });
  } catch (err) {
    next(err);
  }
});

router.delete('/sessions/:sessionId', async (req, res, next) => {
  try {
    const session = await AuthSession.findOne({
      where: {
        id: req.params.sessionId,
        user_id: req.userId
      }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    await session.update({ status: 'revoked' });
    return success(res, null, 'Session revoked');
  } catch (err) {
    next(err);
  }
});

module.exports = router;



