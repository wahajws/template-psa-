module.exports = (sequelize, DataTypes) => {
  const GiftCard = sequelize.define('GiftCard', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    code: { type: DataTypes.STRING(50), allowNull: false },
    initial_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    current_balance: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), defaultValue: 'USD', allowNull: false },
    status: { type: DataTypes.ENUM('active', 'redeemed', 'expired', 'disabled'), defaultValue: 'active', allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: true },
    purchased_by_user_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'users', key: 'id' } },
    assigned_to_user_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'users', key: 'id' } },
    purchase_payment_id: { type: DataTypes.CHAR(36), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'gift_cards', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  GiftCard.associate = function(models) {
    GiftCard.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    GiftCard.belongsTo(models.User, { foreignKey: 'purchased_by_user_id', as: 'purchasedBy' });
    GiftCard.belongsTo(models.User, { foreignKey: 'assigned_to_user_id', as: 'assignedTo' });
  };
  return GiftCard;
};



