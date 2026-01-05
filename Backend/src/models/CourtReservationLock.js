module.exports = (sequelize, DataTypes) => {
  const CourtReservationLock = sequelize.define('CourtReservationLock', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    court_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'courts', key: 'id' } },
    start_datetime: { type: DataTypes.DATE, allowNull: false },
    end_datetime: { type: DataTypes.DATE, allowNull: false },
    booking_item_id: { type: DataTypes.CHAR(36), allowNull: true },
    lock_token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false }
  }, { tableName: 'court_reservation_locks', timestamps: false });
  return CourtReservationLock;
};



