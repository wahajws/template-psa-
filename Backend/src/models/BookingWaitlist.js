module.exports = (sequelize, DataTypes) => {
  const BookingWaitlist = sequelize.define('BookingWaitlist', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    branch_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'branches', key: 'id' } },
    court_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'courts', key: 'id' } },
    requested_start_datetime: { type: DataTypes.DATE, allowNull: false },
    requested_end_datetime: { type: DataTypes.DATE, allowNull: false },
    priority: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    status: { type: DataTypes.STRING(50), defaultValue: 'pending', allowNull: false },
    notified_at: { type: DataTypes.DATE, allowNull: true },
    expires_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'booking_waitlist', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return BookingWaitlist;
};



