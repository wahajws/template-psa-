module.exports = (sequelize, DataTypes) => {
  const TaxRate = sequelize.define('TaxRate', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    branch_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'branches', key: 'id' } },
    name: { type: DataTypes.STRING(255), allowNull: false },
    rate_percentage: { type: DataTypes.DECIMAL(5, 4), allowNull: false },
    tax_type: { type: DataTypes.STRING(50), allowNull: false },
    applies_to: { type: DataTypes.STRING(50), defaultValue: 'all', allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    valid_from: { type: DataTypes.DATEONLY, allowNull: false },
    valid_until: { type: DataTypes.DATEONLY, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: false },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'tax_rates', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return TaxRate;
};



