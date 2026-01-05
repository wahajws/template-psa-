const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticate } = require('../middlewares/auth');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

router.post('/signup', [
  body('first_name').notEmpty(),
  body('last_name').notEmpty(),
  body('email').optional().isEmail(),
  body('phone').optional().matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid phone format'),
  body('password').optional().isLength({ min: 6 }),
  validate
], AuthController.signup.bind(AuthController));

router.post('/login', [
  body('identifier').notEmpty(),
  body('password').notEmpty(),
  validate
], AuthController.login.bind(AuthController));

router.post('/otp/request', [
  body('identifier').notEmpty(),
  body('purpose').optional(),
  validate
], AuthController.requestOtp.bind(AuthController));

router.post('/otp/verify', [
  body('identifier').notEmpty(),
  body('code').notEmpty(),
  body('purpose').optional(),
  validate
], AuthController.verifyOtp.bind(AuthController));

router.post('/refresh', [
  body('refreshToken').notEmpty(),
  validate
], AuthController.refresh.bind(AuthController));

router.post('/logout', authenticate, AuthController.logout.bind(AuthController));

router.get('/me', authenticate, AuthController.getMe.bind(AuthController));
router.patch('/me', authenticate, AuthController.updateMe.bind(AuthController));

module.exports = router;


