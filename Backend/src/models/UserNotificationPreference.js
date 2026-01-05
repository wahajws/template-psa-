module.exports = (sequelize, DataTypes) => {
  const UserNotificationPreference = sequelize.define('UserNotificationPreference', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    notification_type: { type: DataTypes.STRING(50), allowNull: false },
    channel: { type: DataTypes.ENUM('email', 'sms', 'whatsapp', 'push'), allowNull: false },
    is_enabled: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'user_notification_preferences', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return UserNotificationPreference;
};



