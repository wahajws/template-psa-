module.exports = (sequelize, DataTypes) => {
  const CustomerWalletLedger = sequelize.define('CustomerWalletLedger', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    transaction_type: { type: DataTypes.STRING(50), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    balance_after: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    reference_type: { type: DataTypes.STRING(50), allowNull: true },
    reference_id: { type: DataTypes.CHAR(36), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    expires_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'customer_wallet_ledger', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  CustomerWalletLedger.associate = function(models) {
    CustomerWalletLedger.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    CustomerWalletLedger.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
  };
  return CustomerWalletLedger;
};



