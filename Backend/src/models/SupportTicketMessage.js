module.exports = (sequelize, DataTypes) => {
  const SupportTicketMessage = sequelize.define('SupportTicketMessage', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    ticket_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'support_tickets', key: 'id' } },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    message: { type: DataTypes.TEXT, allowNull: false },
    is_internal: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    attachments: { type: DataTypes.JSON, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: false },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'support_ticket_messages', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  
  SupportTicketMessage.associate = function(models) {
    SupportTicketMessage.belongsTo(models.SupportTicket, { foreignKey: 'ticket_id', as: 'ticket' });
    SupportTicketMessage.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };
  
  return SupportTicketMessage;
};

