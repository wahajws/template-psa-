module.exports = (sequelize, DataTypes) => {
  const BranchSpecialHours = sequelize.define('BranchSpecialHours', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    branch_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'branches', key: 'id' } },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    open_time: { type: DataTypes.TIME, allowNull: true },
    close_time: { type: DataTypes.TIME, allowNull: true },
    is_closed: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    reason: { type: DataTypes.STRING(255), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'branch_special_hours', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return BranchSpecialHours;
};



