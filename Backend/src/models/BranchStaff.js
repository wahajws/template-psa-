module.exports = (sequelize, DataTypes) => {
  const BranchStaff = sequelize.define('BranchStaff', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    branch_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'branches', key: 'id' } },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    position: { type: DataTypes.STRING(100), allowNull: true },
    is_manager: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    assigned_by: { type: DataTypes.CHAR(36), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'branch_staff', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return BranchStaff;
};



