const express = require('express');
const router = express.Router({ mergeParams: true });
const BaseService = require('../services/BaseService');
const { Review } = require('../models');
const ReviewService = new BaseService(Review);
const CrudRouterFactory = require('./CrudRouterFactory');
const { authenticate, optionalAuth } = require('../middlewares/auth');
const { validateCompany } = require('../middlewares/tenant');

router.use(optionalAuth);
router.param('companyId', validateCompany);

const reviewRouter = CrudRouterFactory.create(ReviewService, {
  requireAuth: false,
  requireCompany: true
});

router.use('/', reviewRouter);

module.exports = router;



