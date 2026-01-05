module.exports = (sequelize, DataTypes) => {
  const BranchBusinessHours = sequelize.define('BranchBusinessHours', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    branch_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'branches', key: 'id' } },
    day_of_week: { type: DataTypes.INTEGER, allowNull: false },
    open_time: { type: DataTypes.TIME, allowNull: false },
    close_time: { type: DataTypes.TIME, allowNull: false },
    is_closed: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'branch_business_hours', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return BranchBusinessHours;
};



