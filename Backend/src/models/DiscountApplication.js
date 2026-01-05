module.exports = (sequelize, DataTypes) => {
  const DiscountApplication = sequelize.define('DiscountApplication', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    campaign_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'campaigns', key: 'id' } },
    promo_code_id: { type: DataTypes.CHAR(36), allowNull: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    booking_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'bookings', key: 'id' } },
    customer_membership_id: { type: DataTypes.CHAR(36), allowNull: true },
    discount_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    applied_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'discount_applications', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return DiscountApplication;
};



