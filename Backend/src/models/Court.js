module.exports = (sequelize, DataTypes) => {
  const Court = sequelize.define('Court', {
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    court_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    court_type: {
      type: DataTypes.STRING(50),
      defaultValue: 'pickleball',
      allowNull: false
    },
    surface_type: {
      type: DataTypes.ENUM('indoor', 'outdoor', 'hard', 'clay', 'grass', 'synthetic'),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
      allowNull: false
    },
    has_lights: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'maintenance', 'closed', 'deleted'),
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
    tableName: 'courts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Court.associate = function(models) {
    Court.belongsTo(models.Branch, { foreignKey: 'branch_id', as: 'branch' });
    Court.hasMany(models.BookingItem, { foreignKey: 'court_id', as: 'bookingItems' });
  };

  return Court;
};



