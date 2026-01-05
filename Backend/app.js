const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./src/middlewares/errorHandler');
const logger = require('./src/config/logger');

const authRoutes = require('./src/routes/auth');
const companiesRoutes = require('./src/routes/companies');
const bookingsRoutes = require('./src/routes/bookings');
const membershipsRoutes = require('./src/routes/memberships');
const paymentsRoutes = require('./src/routes/payments');
const walletRoutes = require('./src/routes/wallet');
const giftCardsRoutes = require('./src/routes/gift-cards');
const mediaRoutes = require('./src/routes/media');
const availabilityRoutes = require('./src/routes/availability');
const promoCodesRoutes = require('./src/routes/promo-codes');
const sessionsRoutes = require('./src/routes/sessions');
const refundsRoutes = require('./src/routes/refunds');
const invoicesRoutes = require('./src/routes/invoices');
const reviewsRoutes = require('./src/routes/reviews');
const supportTicketsRoutes = require('./src/routes/support-tickets');
const adminRoutes = require('./src/routes/admin');
const telemetryRoutes = require('./src/routes/telemetry');
const behaviourRoutes = require('./src/routes/behaviour');
const { activityContext } = require('./src/middlewares/activity');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(activityContext); // Add activity context to all requests

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/auth/me', sessionsRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/companies/:companyId/branches/:branchId/availability', availabilityRoutes);
app.use('/api/companies/:companyId/bookings', bookingsRoutes);
app.use('/api/companies/:companyId/memberships', membershipsRoutes);
app.use('/api/companies/:companyId/payments', paymentsRoutes);
app.use('/api/companies/:companyId/refunds', refundsRoutes);
app.use('/api/companies/:companyId/invoices', invoicesRoutes);
app.use('/api/companies/:companyId/promos', promoCodesRoutes);
app.use('/api/companies/:companyId/gift-cards', giftCardsRoutes);
app.use('/api/companies/:companyId/reviews', reviewsRoutes);
app.use('/api/companies/:companyId/support-tickets', supportTicketsRoutes);
app.use('/api/me', walletRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/behaviour', behaviourRoutes);

app.use(errorHandler);

module.exports = app;

