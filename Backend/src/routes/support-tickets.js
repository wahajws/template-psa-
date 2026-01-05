const express = require('express');
const router = express.Router({ mergeParams: true });
const BaseService = require('../services/BaseService');
const { SupportTicket, SupportTicketMessage } = require('../models');
const TicketService = new BaseService(SupportTicket);
const { authenticate } = require('../middlewares/auth');
const { validateCompany } = require('../middlewares/tenant');
const { success } = require('../utils/response');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { generateUUID } = require('../utils/uuid');
const { Op } = require('sequelize');

router.use(authenticate);
router.param('companyId', validateCompany);

router.post('/', [
  body('subject').notEmpty(),
  body('message').notEmpty(),
  validate
], async (req, res, next) => {
  try {
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const ticket = await SupportTicket.create({
      id: generateUUID(),
      ticket_number: ticketNumber,
      user_id: req.userId,
      company_id: req.companyId,
      branch_id: req.body.branch_id || null,
      booking_id: req.body.booking_id || null,
      subject: req.body.subject,
      status: 'open',
      priority: req.body.priority || 'medium',
      created_by: req.userId
    });

    if (req.body.message) {
      await SupportTicketMessage.create({
        id: generateUUID(),
        ticket_id: ticket.id,
        user_id: req.userId,
        message: req.body.message,
        is_internal: false,
        created_by: req.userId
      });
    }

    return success(res, { ticket }, 'Ticket created successfully', 201);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const tickets = await TicketService.findAll({
      where: {
        company_id: req.companyId,
        user_id: req.userId,
        deleted_at: { [Op.is]: null }
      },
      include: [{
        model: SupportTicketMessage,
        as: 'messages',
        required: false
      }],
      order: [['created_at', 'DESC']]
    });
    return success(res, { tickets });
  } catch (err) {
    next(err);
  }
});

router.get('/:ticketId', async (req, res, next) => {
  try {
    const ticket = await TicketService.findById(req.params.ticketId, {
      include: [{
        model: SupportTicketMessage,
        as: 'messages',
        required: false,
        separate: true,
        order: [['created_at', 'ASC']]
      }]
    });
    return success(res, { ticket });
  } catch (err) {
    next(err);
  }
});

router.post('/:ticketId/messages', [
  body('message').notEmpty(),
  validate
], async (req, res, next) => {
  try {
    const message = await SupportTicketMessage.create({
      id: generateUUID(),
      ticket_id: req.params.ticketId,
      user_id: req.userId,
      message: req.body.message,
      is_internal: req.body.is_internal || false,
      created_by: req.userId
    });
    return success(res, { message }, 'Message added successfully', 201);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

