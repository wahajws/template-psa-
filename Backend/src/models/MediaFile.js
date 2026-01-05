module.exports = (sequelize, DataTypes) => {
  const MediaFile = sequelize.define('MediaFile', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    owner_type: { type: DataTypes.ENUM('company', 'branch', 'court', 'campaign', 'user', 'service', 'booking', 'membership_plan', 'review', 'other'), allowNull: false },
    owner_id: { type: DataTypes.CHAR(36), allowNull: false },
    storage_mode: { type: DataTypes.ENUM('db_blob', 'external_url'), defaultValue: 'db_blob', allowNull: false },
    file_name: { type: DataTypes.STRING(255), allowNull: false },
    content_type: { type: DataTypes.STRING(100), allowNull: false },
    file_ext: { type: DataTypes.STRING(10), allowNull: true },
    file_size_bytes: { type: DataTypes.BIGINT, allowNull: false },
    checksum_sha256: { type: DataTypes.STRING(64), allowNull: true, unique: true },
    width: { type: DataTypes.INTEGER, allowNull: true },
    height: { type: DataTypes.INTEGER, allowNull: true },
    url: { type: DataTypes.STRING(500), allowNull: true },
    blob_data: { type: DataTypes.BLOB('long'), allowNull: true },
    is_primary: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    metadata: { type: DataTypes.JSON, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'media_files', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return MediaFile;
};



