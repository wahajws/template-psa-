module.exports = (sequelize, DataTypes) => {
  const CustomerMembership = sequelize.define('CustomerMembership', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    membership_plan_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'membership_plans', key: 'id' } },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    branch_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'branches', key: 'id' } },
    status: { type: DataTypes.ENUM('trialing', 'active', 'past_due', 'cancelled', 'expired'), defaultValue: 'active', allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: true },
    auto_renew: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    next_billing_date: { type: DataTypes.DATEONLY, allowNull: true },
    trial_ends_at: { type: DataTypes.DATE, allowNull: true },
    cancelled_at: { type: DataTypes.DATE, allowNull: true },
    cancelled_by: { type: DataTypes.CHAR(36), allowNull: true },
    cancellation_reason: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: false },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'customer_memberships', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  CustomerMembership.associate = function(models) {
    CustomerMembership.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    CustomerMembership.belongsTo(models.MembershipPlan, { foreignKey: 'membership_plan_id', as: 'plan' });
  };
  return CustomerMembership;
};



