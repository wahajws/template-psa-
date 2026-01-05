module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define('GroupMember', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    group_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'groups', key: 'id' } },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    role: { type: DataTypes.STRING(50), defaultValue: 'member', allowNull: false },
    joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'group_members', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return GroupMember;
};



