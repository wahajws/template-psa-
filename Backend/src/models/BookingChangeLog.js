module.exports = (sequelize, DataTypes) => {
  const BookingChangeLog = sequelize.define('BookingChangeLog', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    booking_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'bookings', key: 'id' } },
    change_type: { type: DataTypes.STRING(50), allowNull: false },
    old_value: { type: DataTypes.JSON, allowNull: true },
    new_value: { type: DataTypes.JSON, allowNull: true },
    changed_by: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    reason: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false }
  }, { tableName: 'booking_change_log', timestamps: false });
  return BookingChangeLog;
};



