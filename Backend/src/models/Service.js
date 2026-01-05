module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    company_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'companies', key: 'id' } },
    name: { type: DataTypes.STRING(255), allowNull: false },
    service_type: { type: DataTypes.ENUM('court_booking', 'gym_membership', 'class_session', 'coaching', 'equipment_rental', 'other'), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    base_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    currency: { type: DataTypes.STRING(3), defaultValue: 'USD', allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: false },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'services', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  Service.associate = function(models) {
    Service.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
  };
  return Service;
};



