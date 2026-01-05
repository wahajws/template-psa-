module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    branch_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'branches', key: 'id' } },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    discount_type: { type: DataTypes.ENUM('percent_off', 'fixed_amount_off'), allowNull: false },
    discount_value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    min_purchase_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    max_discount_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    applicability: { type: DataTypes.ENUM('bookings', 'memberships', 'specific_services', 'specific_courts', 'all'), allowNull: false },
    service_id: { type: DataTypes.CHAR(36), allowNull: true },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    day_of_week_mask: { type: DataTypes.INTEGER, allowNull: true },
    time_window_start: { type: DataTypes.TIME, allowNull: true },
    time_window_end: { type: DataTypes.TIME, allowNull: true },
    usage_limit_per_user: { type: DataTypes.INTEGER, allowNull: true },
    total_usage_limit: { type: DataTypes.INTEGER, allowNull: true },
    current_usage_count: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    can_stack_with_membership: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: false },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'campaigns', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  
  Campaign.associate = function(models) {
    Campaign.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    Campaign.belongsTo(models.Branch, { foreignKey: 'branch_id', as: 'branch' });
    Campaign.hasMany(models.PromoCode, { foreignKey: 'campaign_id', as: 'promoCodes' });
  };
  
  return Campaign;
};

