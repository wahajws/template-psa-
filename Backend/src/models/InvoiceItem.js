module.exports = (sequelize, DataTypes) => {
  const InvoiceItem = sequelize.define('InvoiceItem', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    invoice_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'invoices', key: 'id' } },
    item_type: { type: DataTypes.STRING(50), allowNull: false },
    item_reference_id: { type: DataTypes.CHAR(36), allowNull: true },
    description: { type: DataTypes.STRING(500), allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    discount_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
    tax_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'invoice_items', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  
  InvoiceItem.associate = function(models) {
    InvoiceItem.belongsTo(models.Invoice, { foreignKey: 'invoice_id', as: 'invoice' });
  };
  
  return InvoiceItem;
};

