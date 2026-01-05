module.exports = (sequelize, DataTypes) => {
  const ServiceBranchAvailability = sequelize.define('ServiceBranchAvailability', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    service_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'services', key: 'id' } },
    branch_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'branches', key: 'id' } },
    is_available: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    price_override: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'service_branch_availability', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return ServiceBranchAvailability;
};



