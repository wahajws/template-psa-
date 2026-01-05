module.exports = (sequelize, DataTypes) => {
  const CourtFeature = sequelize.define('CourtFeature', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    court_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'courts', key: 'id' } },
    feature_name: { type: DataTypes.STRING(100), allowNull: false },
    feature_value: { type: DataTypes.STRING(255), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'court_features', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return CourtFeature;
};



