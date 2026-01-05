module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    invoice_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    branch_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'branches', key: 'id' } },
    invoice_status: { type: DataTypes.ENUM('draft', 'issued', 'paid', 'overdue', 'cancelled', 'voided'), defaultValue: 'draft', allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    tax_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
    discount_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), defaultValue: 'USD', allowNull: false },
    due_date: { type: DataTypes.DATEONLY, allowNull: true },
    issued_at: { type: DataTypes.DATE, allowNull: true },
    paid_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'invoices', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  
  Invoice.associate = function(models) {
    Invoice.hasMany(models.InvoiceItem, { foreignKey: 'invoice_id', as: 'items' });
  };
  
  return Invoice;
};

