module.exports = (sequelize, DataTypes) => {
  const BookingParticipant = sequelize.define('BookingParticipant', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    booking_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'bookings', key: 'id' } },
    user_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'users', key: 'id' } },
    guest_name: { type: DataTypes.STRING(255), allowNull: true },
    guest_email: { type: DataTypes.STRING(255), allowNull: true },
    guest_phone: { type: DataTypes.STRING(20), allowNull: true },
    is_primary: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'booking_participants', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return BookingParticipant;
};



