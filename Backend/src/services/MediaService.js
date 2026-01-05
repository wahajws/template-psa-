const BaseService = require('./BaseService');
const { MediaFile } = require('../models');
const { generateUUID } = require('../utils/uuid');
const crypto = require('crypto');

class MediaService extends BaseService {
  constructor() {
    super(MediaFile);
  }

  async upload(file, ownerType, ownerId, userId) {
    const fileBuffer = file.buffer;
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    const existing = await MediaFile.findOne({
      where: { checksum_sha256: checksum, deleted_at: null }
    });

    if (existing) {
      return existing;
    }

    const mediaFile = await MediaFile.create({
      id: generateUUID(),
      owner_type: ownerType,
      owner_id: ownerId,
      storage_mode: 'db_blob',
      file_name: file.originalname,
      content_type: file.mimetype,
      file_ext: file.originalname.split('.').pop(),
      file_size_bytes: fileBuffer.length,
      checksum_sha256: checksum,
      blob_data: fileBuffer,
      is_primary: false,
      created_by: userId
    });

    return mediaFile;
  }

  async getByOwner(ownerType, ownerId) {
    return MediaFile.findAll({
      where: {
        owner_type: ownerType,
        owner_id: ownerId,
        deleted_at: null
      },
      order: [['is_primary', 'DESC'], ['sort_order', 'ASC']]
    });
  }
}

module.exports = new MediaService();



