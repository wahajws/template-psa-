module.exports = (sequelize, DataTypes) => {
  const CompanyCustomer = sequelize.define('CompanyCustomer', {
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
    company_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'left', 'blocked'),
      defaultValue: 'active',
      allowNull: false
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    marketing_opt_in: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    default_branch_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'branches',
        key: 'id'
      }
    },
    left_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    blocked_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    blocked_reason: {
      type: DataTypes.TEXT,
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
    tableName: 'company_customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  CompanyCustomer.associate = function(models) {
    CompanyCustomer.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    CompanyCustomer.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    CompanyCustomer.belongsTo(models.Branch, { foreignKey: 'default_branch_id', as: 'defaultBranch' });
  };

  return CompanyCustomer;
};



