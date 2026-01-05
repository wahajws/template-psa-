module.exports = (sequelize, DataTypes) => {
  const MembershipPlanBenefit = sequelize.define('MembershipPlanBenefit', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    membership_plan_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'membership_plans', key: 'id' } },
    benefit_type: { type: DataTypes.STRING(50), allowNull: false },
    benefit_value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    max_per_period: { type: DataTypes.INTEGER, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'membership_plan_benefits', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return MembershipPlanBenefit;
};



