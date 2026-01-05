const AuthService = require('../services/AuthService');
const { success, error } = require('../utils/response');
const { logActivity } = require('../middlewares/activity');

class AuthController {
  async signup(req, res, next) {
    try {
      const user = await AuthService.signup(req.body);
      await logActivity(req, {
        action: 'signup',
        entity_type: 'auth',
        entity_id: user.id,
        metadata: { email: user.email, phone: user.phone },
      });
      return success(res, { user }, 'User created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { identifier, password } = req.body;
      const result = await AuthService.login(identifier, password);
      await logActivity(req, {
        action: 'login',
        entity_type: 'auth',
        entity_id: result.user.id,
        metadata: { identifier },
      });
      return success(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async requestOtp(req, res, next) {
    try {
      const { identifier, purpose } = req.body;
      const result = await AuthService.requestOtp(identifier, purpose);
      await logActivity(req, {
        action: 'otp_request',
        entity_type: 'auth',
        entity_id: result.user?.id || null,
        metadata: { identifier, purpose },
      });
      return success(res, result, 'OTP sent successfully');
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { identifier, code, purpose } = req.body;
      const result = await AuthService.verifyOtp(identifier, code, purpose);
      await logActivity(req, {
        action: 'otp_verify',
        entity_type: 'auth',
        entity_id: result.user?.id || null,
        metadata: { identifier, purpose },
      });
      return success(res, result, 'OTP verified successfully');
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      await logActivity(req, {
        action: 'refresh',
        entity_type: 'auth',
        entity_id: result.user?.id || null,
      });
      return success(res, result, 'Token refreshed successfully');
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers.authorization?.substring(7);
      await AuthService.logout(token);
      return success(res, null, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const { UserRole, Role } = require('../models');
      const user = await AuthService.findById(req.userId, {
        include: [{
          model: UserRole,
          as: 'userRoles',
          include: [{
            model: Role,
            as: 'role',
            required: false
          }],
          required: false
        }]
      });
      
      // Format roles for frontend
      const roles = user.userRoles?.map(ur => ur.role ? {
        id: ur.role.id,
        name: ur.role.role_type || ur.role.name,
        company_id: ur.company_id,
        branch_id: ur.branch_id
      } : null).filter(Boolean) || [];
      
      const userData = {
        ...user.toJSON(),
        roles
      };
      
      return success(res, { user: userData }, 'User retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateMe(req, res, next) {
    try {
      const user = await AuthService.update(req.userId, req.body);
      return success(res, { user }, 'User updated successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();


