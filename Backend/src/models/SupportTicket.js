module.exports = (sequelize, DataTypes) => {
  const SupportTicket = sequelize.define('SupportTicket', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    ticket_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    company_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'companies', key: 'id' } },
    branch_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'branches', key: 'id' } },
    booking_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'bookings', key: 'id' } },
    subject: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'), defaultValue: 'open', allowNull: false },
    priority: { type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'), defaultValue: 'medium', allowNull: false },
    assigned_to: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'users', key: 'id' } },
    resolved_at: { type: DataTypes.DATE, allowNull: true },
    resolved_by: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'users', key: 'id' } },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: false },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'support_tickets', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  
  SupportTicket.associate = function(models) {
    SupportTicket.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    SupportTicket.hasMany(models.SupportTicketMessage, { foreignKey: 'ticket_id', as: 'messages' });
  };
  
  return SupportTicket;
};

