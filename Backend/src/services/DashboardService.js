const { Op } = require('sequelize');
const {
  Company,
  Branch,
  User,
  Booking,
  Payment
} = require('../models');

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function lastNDays(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function recentBookings(where = {}) {
  return Booking.findAll({
    where,
    order: [['created_at', 'DESC']],
    limit: 10
  });
}

async function platformSummary() {
  const since30 = lastNDays(30);

  const [companies, branches, users, bookings30] = await Promise.all([
    Company.count({ where: { deleted_at: { [Op.is]: null } } }),
    Branch.count({ where: { deleted_at: { [Op.is]: null } } }),
    User.count({ where: { deleted_at: { [Op.is]: null } } }),
    Booking.count({
      where: {
        deleted_at: { [Op.is]: null },
        created_at: { [Op.gte]: since30 }
      }
    })
  ]);

  const bookingsToday = await Booking.count({
    where: {
      deleted_at: { [Op.is]: null },
      created_at: { [Op.gte]: startOfToday() }
    }
  });

  const recent = await recentBookings({ deleted_at: { [Op.is]: null } });

  return {
    kpis: { companies, branches, users, bookingsToday, bookings30 },
    recentBookings: recent
  };
}

async function companySummary(companyId) {
  const since30 = lastNDays(30);

  const whereBranch = { company_id: companyId, deleted_at: { [Op.is]: null } };
  const whereBooking = { company_id: companyId, deleted_at: { [Op.is]: null } };

  const [branches, bookings30] = await Promise.all([
    Branch.count({ where: whereBranch }),
    Booking.count({ where: { ...whereBooking, created_at: { [Op.gte]: since30 } } })
  ]);

  const bookingsToday = await Booking.count({
    where: { ...whereBooking, created_at: { [Op.gte]: startOfToday() } }
  });

  const recent = await recentBookings(whereBooking);

  return {
    kpis: { branches, bookingsToday, bookings30 },
    recentBookings: recent
  };
}

async function branchSummary(companyId, branchId) {
  const since30 = lastNDays(30);

  const whereBooking = {
    company_id: companyId,
    branch_id: branchId,
    deleted_at: { [Op.is]: null }
  };

  const [bookings30, bookingsToday] = await Promise.all([
    Booking.count({ where: { ...whereBooking, created_at: { [Op.gte]: since30 } } }),
    Booking.count({ where: { ...whereBooking, created_at: { [Op.gte]: startOfToday() } } })
  ]);

  const recent = await recentBookings(whereBooking);

  return {
    kpis: { bookingsToday, bookings30 },
    recentBookings: recent
  };
}

module.exports = { platformSummary, companySummary, branchSummary };
