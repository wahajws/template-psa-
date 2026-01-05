module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    booking_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'bookings', key: 'id' } },
    invoice_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'invoices', key: 'id' } },
    membership_cycle_id: { type: DataTypes.CHAR(36), allowNull: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), defaultValue: 'USD', allowNull: false },
    payment_method: { type: DataTypes.ENUM('credit_card', 'debit_card', 'bank_transfer', 'wallet', 'cash', 'other'), allowNull: false },
    payment_status: { type: DataTypes.ENUM('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded'), defaultValue: 'pending', allowNull: false },
    provider: { type: DataTypes.STRING(50), allowNull: true },
    provider_transaction_id: { type: DataTypes.STRING(255), allowNull: true },
    provider_metadata: { type: DataTypes.JSON, allowNull: true },
    failure_reason: { type: DataTypes.TEXT, allowNull: true },
    paid_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'payments', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  Payment.associate = function(models) {
    Payment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Payment.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    Payment.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
  };
  return Payment;
};



