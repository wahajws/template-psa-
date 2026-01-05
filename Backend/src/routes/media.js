const express = require('express');
const router = express.Router();
const MediaService = require('../services/MediaService');
const { authenticate, optionalAuth } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const { success } = require('../utils/response');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { logActivity } = require('../middlewares/activity');

router.post('/upload', authenticate, upload, async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const { owner_type, owner_id } = req.body;
    const mediaFile = await MediaService.upload(
      req.file,
      owner_type,
      owner_id,
      req.userId
    );
    await logActivity(req, {
      action: 'media_uploaded',
      entity_type: 'media',
      entity_id: mediaFile.id,
      metadata: { owner_type, owner_id, file_name: req.file.originalname },
    });
    return success(res, { mediaFile }, 'File uploaded successfully', 201);
  } catch (err) {
    next(err);
  }
});

router.get('/:mediaId', optionalAuth, async (req, res, next) => {
  try {
    const mediaFile = await MediaService.findById(req.params.mediaId);
    if (mediaFile.storage_mode === 'db_blob' && mediaFile.blob_data) {
      res.set('Content-Type', mediaFile.content_type);
      res.set('Content-Disposition', `inline; filename="${mediaFile.file_name}"`);
      return res.send(mediaFile.blob_data);
    }
    return success(res, { mediaFile });
  } catch (err) {
    next(err);
  }
});

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { owner_type, owner_id } = req.query;
    if (!owner_type || !owner_id) {
      return res.status(400).json({ success: false, message: 'owner_type and owner_id required' });
    }
    const mediaFiles = await MediaService.getByOwner(owner_type, owner_id);
    return success(res, { mediaFiles });
  } catch (err) {
    next(err);
  }
});

router.patch('/:mediaId', authenticate, [
  body('is_primary').optional().isBoolean(),
  body('sort_order').optional().isInt(),
  validate
], async (req, res, next) => {
  try {
    const mediaFile = await MediaService.update(req.params.mediaId, req.body);
    return success(res, { mediaFile }, 'Media updated successfully');
  } catch (err) {
    next(err);
  }
});

router.delete('/:mediaId', authenticate, async (req, res, next) => {
  try {
    const mediaFile = await MediaService.findById(req.params.mediaId);
    await MediaService.delete(req.params.mediaId);
    await logActivity(req, {
      action: 'media_deleted',
      entity_type: 'media',
      entity_id: req.params.mediaId,
      metadata: { owner_type: mediaFile?.owner_type, owner_id: mediaFile?.owner_id },
    });
    return success(res, null, 'Media deleted successfully');
  } catch (err) {
    next(err);
  }
});

module.exports = router;


