module.exports = (sequelize, DataTypes) => {
  const MembershipUsageLedger = sequelize.define('MembershipUsageLedger', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    customer_membership_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'customer_memberships', key: 'id' } },
    booking_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'bookings', key: 'id' } },
    benefit_type: { type: DataTypes.STRING(50), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    period_start_date: { type: DataTypes.DATEONLY, allowNull: true },
    period_end_date: { type: DataTypes.DATEONLY, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'membership_usage_ledger', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return MembershipUsageLedger;
};



