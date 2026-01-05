module.exports = (sequelize, DataTypes) => {
  const NotificationTemplate = sequelize.define('NotificationTemplate', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    company_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'companies', key: 'id' } },
    template_name: { type: DataTypes.STRING(100), allowNull: false },
    notification_type: { type: DataTypes.STRING(50), allowNull: false },
    channel: { type: DataTypes.ENUM('email', 'sms', 'whatsapp', 'push'), allowNull: false },
    subject: { type: DataTypes.STRING(255), allowNull: true },
    body_template: { type: DataTypes.TEXT, allowNull: false },
    variables: { type: DataTypes.JSON, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'notification_templates', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return NotificationTemplate;
};



