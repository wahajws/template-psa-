module.exports = (sequelize, DataTypes) => {
  const CourtRateRule = sequelize.define('CourtRateRule', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    branch_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'branches', key: 'id' } },
    court_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'courts', key: 'id' } },
    day_of_week: { type: DataTypes.INTEGER, allowNull: true },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    rate_per_hour: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    applies_to_members: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    membership_plan_id: { type: DataTypes.CHAR(36), allowNull: true },
    valid_from: { type: DataTypes.DATEONLY, allowNull: false },
    valid_until: { type: DataTypes.DATEONLY, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: false },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'court_rate_rules', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return CourtRateRule;
};



