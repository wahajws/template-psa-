module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    role_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    permission_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    created_by: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    updated_by: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'role_permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return RolePermission;
};



