module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo_media_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'media_files',
        key: 'id'
      }
    },
    website_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    timezone: {
      type: DataTypes.STRING(50),
      defaultValue: 'UTC',
      allowNull: false
    },
    default_currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'deleted'),
      defaultValue: 'active',
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
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
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
    tableName: 'companies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Company.associate = function(models) {
    Company.hasMany(models.Branch, { foreignKey: 'company_id', as: 'branches' });
    Company.hasMany(models.CompanyCustomer, { foreignKey: 'company_id', as: 'customers' });
    Company.hasMany(models.Service, { foreignKey: 'company_id', as: 'services' });
    Company.hasMany(models.MembershipPlan, { foreignKey: 'company_id', as: 'membershipPlans' });
    Company.hasMany(models.Campaign, { foreignKey: 'company_id', as: 'campaigns' });
  };

  return Company;
};



