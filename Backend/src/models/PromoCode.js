module.exports = (sequelize, DataTypes) => {
  const PromoCode = sequelize.define('PromoCode', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    campaign_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'campaigns', key: 'id' } },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    code: { type: DataTypes.STRING(50), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'promo_codes', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  
  PromoCode.associate = function(models) {
    PromoCode.belongsTo(models.Campaign, { foreignKey: 'campaign_id', as: 'campaign' });
    PromoCode.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
  };
  
  return PromoCode;
};

