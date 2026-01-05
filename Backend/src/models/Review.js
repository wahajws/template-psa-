module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    company_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'companies', key: 'id' } },
    branch_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'branches', key: 'id' } },
    court_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'courts', key: 'id' } },
    service_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'services', key: 'id' } },
    booking_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'bookings', key: 'id' } },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: true },
    comment: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected', 'hidden'), defaultValue: 'pending', allowNull: false },
    helpful_count: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'reviews', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return Review;
};



