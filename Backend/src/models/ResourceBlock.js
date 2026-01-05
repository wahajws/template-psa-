module.exports = (sequelize, DataTypes) => {
  const ResourceBlock = sequelize.define('ResourceBlock', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    branch_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'branches', key: 'id' } },
    court_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'courts', key: 'id' } },
    block_type: { type: DataTypes.ENUM('maintenance', 'closure', 'private_event', 'buffer', 'holiday'), allowNull: false },
    start_datetime: { type: DataTypes.DATE, allowNull: false },
    end_datetime: { type: DataTypes.DATE, allowNull: false },
    reason: { type: DataTypes.STRING(255), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: false },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'resource_blocks', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  
  ResourceBlock.associate = function(models) {
    ResourceBlock.belongsTo(models.Branch, { foreignKey: 'branch_id', as: 'branch' });
    ResourceBlock.belongsTo(models.Court, { foreignKey: 'court_id', as: 'court' });
  };
  
  return ResourceBlock;
};

