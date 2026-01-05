module.exports = (sequelize, DataTypes) => {
  const MembershipCycle = sequelize.define('MembershipCycle', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    customer_membership_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'customer_memberships', key: 'id' } },
    cycle_number: { type: DataTypes.INTEGER, allowNull: false },
    period_start_date: { type: DataTypes.DATEONLY, allowNull: false },
    period_end_date: { type: DataTypes.DATEONLY, allowNull: false },
    billing_date: { type: DataTypes.DATEONLY, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    discount_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
    tax_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_status: { type: DataTypes.ENUM('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded'), defaultValue: 'pending', allowNull: false },
    invoice_id: { type: DataTypes.CHAR(36), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'membership_cycles', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return MembershipCycle;
};



