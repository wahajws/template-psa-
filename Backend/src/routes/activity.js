const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/ActivityController');
const { authenticate } = require('../middlewares/auth');
const { requirePlatformAdmin } = require('../middlewares/rbac');

// All routes require platform admin
router.use(authenticate, requirePlatformAdmin);

router.get('/', ActivityController.getActivities.bind(ActivityController));
router.get('/export', ActivityController.exportActivities.bind(ActivityController));

module.exports = router;


