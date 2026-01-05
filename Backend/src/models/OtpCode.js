module.exports = (sequelize, DataTypes) => {
  const OtpCode = sequelize.define('OtpCode', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'verified', 'expired', 'used'),
      defaultValue: 'pending',
      allowNull: false
    },
    purpose: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    max_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
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
    tableName: 'otp_codes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  OtpCode.associate = function(models) {
    OtpCode.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return OtpCode;
};



