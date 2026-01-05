module.exports = (sequelize, DataTypes) => {
  const BookingItem = sequelize.define('BookingItem', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'bookings',
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
    branch_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'branches',
        key: 'id'
      }
    },
    court_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'courts',
        key: 'id'
      }
    },
    service_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    start_datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
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
    tableName: 'booking_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  BookingItem.associate = function(models) {
    BookingItem.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
    BookingItem.belongsTo(models.Court, { foreignKey: 'court_id', as: 'court' });
    BookingItem.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
  };

  return BookingItem;
};



