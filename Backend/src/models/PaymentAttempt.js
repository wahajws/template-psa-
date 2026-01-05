module.exports = (sequelize, DataTypes) => {
  const PaymentAttempt = sequelize.define('PaymentAttempt', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    payment_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'payments', key: 'id' } },
    attempt_number: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_method: { type: DataTypes.ENUM('credit_card', 'debit_card', 'bank_transfer', 'wallet', 'cash', 'other'), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded'), defaultValue: 'pending', allowNull: false },
    provider_response: { type: DataTypes.JSON, allowNull: true },
    failure_reason: { type: DataTypes.TEXT, allowNull: true },
    attempted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'payment_attempts', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return PaymentAttempt;
};



