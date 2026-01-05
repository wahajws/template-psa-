module.exports = (sequelize, DataTypes) => {
  const MediaVariant = sequelize.define('MediaVariant', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    media_file_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'media_files', key: 'id' } },
    variant_type: { type: DataTypes.ENUM('thumbnail', 'small', 'medium', 'large', 'original'), allowNull: false },
    file_name: { type: DataTypes.STRING(255), allowNull: false },
    content_type: { type: DataTypes.STRING(100), allowNull: false },
    file_size_bytes: { type: DataTypes.BIGINT, allowNull: false },
    width: { type: DataTypes.INTEGER, allowNull: true },
    height: { type: DataTypes.INTEGER, allowNull: true },
    blob_data: { type: DataTypes.BLOB('long'), allowNull: false },
    checksum_sha256: { type: DataTypes.STRING(64), allowNull: true, unique: true },
    metadata: { type: DataTypes.JSON, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'media_variants', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return MediaVariant;
};



