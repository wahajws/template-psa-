module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    company_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    branch_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'branches',
        key: 'id'
      }
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    assigned_by: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
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
    tableName: 'user_roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  UserRole.associate = function(models) {
    UserRole.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    UserRole.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
    UserRole.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    UserRole.belongsTo(models.Branch, { foreignKey: 'branch_id', as: 'branch' });
  };

  return UserRole;
};



