module.exports = (sequelize, DataTypes) => {
  const NotificationOutbox = sequelize.define('NotificationOutbox', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    template_id: { type: DataTypes.CHAR(36), allowNull: true },
    notification_type: { type: DataTypes.STRING(50), allowNull: false },
    channel: { type: DataTypes.ENUM('email', 'sms', 'whatsapp', 'push'), allowNull: false },
    recipient_email: { type: DataTypes.STRING(255), allowNull: true },
    recipient_phone: { type: DataTypes.STRING(20), allowNull: true },
    subject: { type: DataTypes.STRING(255), allowNull: true },
    body: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'sent', 'delivered', 'failed', 'bounced'), defaultValue: 'pending', allowNull: false },
    scheduled_at: { type: DataTypes.DATE, allowNull: true },
    sent_at: { type: DataTypes.DATE, allowNull: true },
    delivered_at: { type: DataTypes.DATE, allowNull: true },
    failure_reason: { type: DataTypes.TEXT, allowNull: true },
    retry_count: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    max_retries: { type: DataTypes.INTEGER, defaultValue: 3, allowNull: false },
    metadata: { type: DataTypes.JSON, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'notifications_outbox', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return NotificationOutbox;
};



