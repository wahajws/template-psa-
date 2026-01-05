module.exports = (sequelize, DataTypes) => {
  const CourtTimeSlot = sequelize.define('CourtTimeSlot', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    court_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'courts', key: 'id' } },
    slot_start_datetime: { type: DataTypes.DATE, allowNull: false },
    slot_end_datetime: { type: DataTypes.DATE, allowNull: false },
    booking_item_id: { type: DataTypes.CHAR(36), allowNull: true },
    is_locked: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'court_time_slots', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return CourtTimeSlot;
};



