module.exports = (sequelize, DataTypes) => {
  const BranchContact = sequelize.define('BranchContact', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    branch_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'branches',
        key: 'id'
      }
    },
    contact_type: {
      type: DataTypes.ENUM('phone', 'email', 'fax', 'whatsapp'),
      allowNull: false
    },
    contact_value: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(100),
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
    tableName: 'branch_contacts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  BranchContact.associate = function(models) {
    BranchContact.belongsTo(models.Branch, { foreignKey: 'branch_id', as: 'branch' });
  };

  return BranchContact;
};



