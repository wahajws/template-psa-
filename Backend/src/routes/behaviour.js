const express = require('express');
const router = express.Router();
const BehaviourController = require('../controllers/BehaviourController');
const { authenticate } = require('../middlewares/auth');
const { requirePlatformAdmin } = require('../middlewares/rbac');

// All routes require platform admin
router.use(authenticate, requirePlatformAdmin);

router.get('/', BehaviourController.getBehaviourEvents.bind(BehaviourController));
router.get('/export', BehaviourController.exportBehaviourEvents.bind(BehaviourController));

module.exports = router;


