module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    actor_user_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' } },
    // Note: action can be string for extended actions beyond enum
    action: { type: DataTypes.STRING(100), allowNull: false },
    entity_type: { type: DataTypes.STRING(100), allowNull: false },
    entity_id: { type: DataTypes.CHAR(36), allowNull: false },
    before_snapshot: { type: DataTypes.JSON, allowNull: true },
    after_snapshot: { type: DataTypes.JSON, allowNull: true },
    ip_address: { type: DataTypes.STRING(45), allowNull: true },
    user_agent: { type: DataTypes.TEXT, allowNull: true },
    metadata: { type: DataTypes.JSON, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false }
  }, { tableName: 'audit_logs', timestamps: false });
  return AuditLog;
};


