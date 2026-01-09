// src/routes/admin/companies.js
const express = require('express');
const { Company } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  const companies = await Company.findAll({ include: ['branches'] });
  res.json(companies);
});

module.exports = router;