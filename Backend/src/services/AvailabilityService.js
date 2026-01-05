const { Branch, BranchBusinessHours, BranchSpecialHours, ResourceBlock, BookingItem, Court, Booking } = require('../models');
const { Op } = require('sequelize');

class AvailabilityService {
  async getBranchAvailability(branchId, startDate, endDate) {
    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      throw new Error('Branch not found');
    }

    const businessHours = await BranchBusinessHours.findAll({
      where: { branch_id: branchId, deleted_at: null }
    });

    const specialHours = await BranchSpecialHours.findAll({
      where: {
        branch_id: branchId,
        date: { [Op.between]: [startDate, endDate] },
        deleted_at: null
      }
    });

    const resourceBlocks = await ResourceBlock.findAll({
      where: {
        branch_id: branchId,
        is_active: true,
        deleted_at: null,
        [Op.or]: [
          {
            start_datetime: { [Op.lte]: new Date(endDate) },
            end_datetime: { [Op.gte]: new Date(startDate) }
          }
        ]
      },
      include: [{ model: Court, as: 'court', required: false }]
    });

    const courts = await Court.findAll({
      where: {
        branch_id: branchId,
        status: 'active',
        deleted_at: null
      }
    });

    const bookings = await BookingItem.findAll({
      where: {
        branch_id: branchId,
        deleted_at: null,
        start_datetime: { [Op.gte]: new Date(startDate) },
        end_datetime: { [Op.lte]: new Date(endDate) }
      },
      include: [{
        model: Booking,
        as: 'booking',
        where: {
          booking_status: { [Op.notIn]: ['cancelled', 'expired'] },
          deleted_at: null
        },
        required: true
      }]
    });

    return {
      branch,
      businessHours,
      specialHours,
      resourceBlocks,
      courts,
      bookings: bookings.map(b => ({
        court_id: b.court_id,
        start_datetime: b.start_datetime,
        end_datetime: b.end_datetime
      }))
    };
  }
}

module.exports = new AvailabilityService();

