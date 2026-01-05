module.exports = (sequelize, DataTypes) => {
  const AuthIdentity = sequelize.define('AuthIdentity', {
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
    provider: {
      type: DataTypes.ENUM('email_password', 'phone_otp', 'google', 'facebook', 'apple'),
      allowNull: false
    },
    provider_user_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    provider_metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    verified_at: {
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
    tableName: 'auth_identities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  AuthIdentity.associate = function(models) {
    AuthIdentity.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return AuthIdentity;
};



