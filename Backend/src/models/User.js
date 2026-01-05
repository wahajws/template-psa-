module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'deleted'),
      defaultValue: 'active',
      allowNull: false
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    phone_verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_login_at: {
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
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: false
  });

  User.associate = function(models) {
    User.hasMany(models.UserRole, { foreignKey: 'user_id', as: 'userRoles' });
    User.hasMany(models.AuthIdentity, { foreignKey: 'user_id', as: 'authIdentities' });
    User.hasMany(models.AuthSession, { foreignKey: 'user_id', as: 'sessions' });
    User.hasMany(models.CompanyCustomer, { foreignKey: 'user_id', as: 'companySubscriptions' });
    User.hasMany(models.Booking, { foreignKey: 'user_id', as: 'bookings' });
    User.hasMany(models.CustomerMembership, { foreignKey: 'user_id', as: 'memberships' });
  };

  return User;
};



