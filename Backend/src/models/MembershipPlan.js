module.exports = (sequelize, DataTypes) => {
  const MembershipPlan = sequelize.define('MembershipPlan', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    branch_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'branches', key: 'id' } },
    service_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'services', key: 'id' } },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    plan_type: { type: DataTypes.ENUM('recurring', 'prepaid_pass', 'credits'), allowNull: false },
    plan_scope: { type: DataTypes.ENUM('company_wide', 'branch_specific'), allowNull: false },
    billing_type: { type: DataTypes.ENUM('monthly', 'annual', 'prepaid_passes', 'credits'), allowNull: false },
    billing_cycle_days: { type: DataTypes.INTEGER, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), defaultValue: 'USD', allowNull: false },
    max_active_per_user: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: false },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'membership_plans', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  MembershipPlan.associate = function(models) {
    MembershipPlan.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    MembershipPlan.belongsTo(models.Branch, { foreignKey: 'branch_id', as: 'branch' });
    MembershipPlan.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
  };
  return MembershipPlan;
};



