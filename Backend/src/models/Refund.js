module.exports = (sequelize, DataTypes) => {
  const Refund = sequelize.define('Refund', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    payment_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'payments', key: 'id' } },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), defaultValue: 'USD', allowNull: false },
    refund_status: { type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'), defaultValue: 'pending', allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: true },
    provider_refund_id: { type: DataTypes.STRING(255), allowNull: true },
    provider_metadata: { type: DataTypes.JSON, allowNull: true },
    processed_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: false },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'refunds', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return Refund;
};



