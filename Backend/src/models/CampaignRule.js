module.exports = (sequelize, DataTypes) => {
  const CampaignRule = sequelize.define('CampaignRule', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    campaign_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'campaigns', key: 'id' } },
    rule_type: { type: DataTypes.STRING(50), allowNull: false },
    rule_value: { type: DataTypes.STRING(255), allowNull: false },
    operator: { type: DataTypes.STRING(20), defaultValue: 'equals', allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'campaign_rules', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return CampaignRule;
};



