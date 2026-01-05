module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    role_type: {
      type: DataTypes.ENUM('platform_super_admin', 'company_admin', 'branch_manager', 'branch_staff', 'customer'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_system_role: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
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
    tableName: 'roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Role.associate = function(models) {
    Role.hasMany(models.UserRole, { foreignKey: 'role_id', as: 'userRoles' });
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: 'role_id',
      otherKey: 'permission_id',
      as: 'permissions'
    });
  };

  return Role;
};



