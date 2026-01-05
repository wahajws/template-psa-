module.exports = (sequelize, DataTypes) => {
  const NotificationDeliveryLog = sequelize.define('NotificationDeliveryLog', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    notification_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'notifications_outbox', key: 'id' } },
    provider: { type: DataTypes.STRING(50), allowNull: true },
    provider_message_id: { type: DataTypes.STRING(255), allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'sent', 'delivered', 'failed', 'bounced'), allowNull: false },
    response_metadata: { type: DataTypes.JSON, allowNull: true },
    logged_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'notification_delivery_logs', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return NotificationDeliveryLog;
};



