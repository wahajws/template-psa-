module.exports = (sequelize, DataTypes) => {
  const AuthSession = sequelize.define('AuthSession', {
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
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'revoked'),
      defaultValue: 'active',
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    device_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    last_activity_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    tableName: 'auth_sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  AuthSession.associate = function(models) {
    AuthSession.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return AuthSession;
};



