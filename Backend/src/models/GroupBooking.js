module.exports = (sequelize, DataTypes) => {
  const GroupBooking = sequelize.define('GroupBooking', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    group_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'groups', key: 'id' } },
    booking_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'bookings', key: 'id' } },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'group_bookings', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return GroupBooking;
};



