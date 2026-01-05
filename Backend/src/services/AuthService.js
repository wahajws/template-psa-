const BaseService = require('./BaseService');
const { User, AuthIdentity, AuthSession, OtpCode, UserRole, Role } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { generateUUID } = require('../utils/uuid');
const { UnauthorizedError, ValidationError } = require('../utils/errors');
const { Op } = require('sequelize');

class AuthService extends BaseService {
  constructor() {
    super(User);
  }

  async signup(data) {
    const { email, phone, password, first_name, last_name } = data;
    
    if (!email && !phone) {
      throw new ValidationError('Email or phone is required');
    }

    if (email) {
      const existing = await User.findOne({ where: { email, deleted_at: { [Op.is]: null } } });
      if (existing) {
        throw new ValidationError('Email already exists');
      }
    }

    if (phone) {
      const existing = await User.findOne({ where: { phone, deleted_at: { [Op.is]: null } } });
      if (existing) {
        throw new ValidationError('Phone already exists');
      }
    }

    const userId = generateUUID();
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const user = await User.create({
      id: userId,
      email,
      phone,
      first_name,
      last_name,
      status: 'active',
      created_by: userId
    });

    if (passwordHash) {
      await AuthIdentity.create({
        id: generateUUID(),
        user_id: userId,
        provider: 'email_password',
        provider_user_id: email || phone,
        email,
        phone,
        is_primary: true,
        verified_at: new Date(),
        provider_metadata: { password_hash: passwordHash }
      });
    }

    return user;
  }

  async login(identifier, password) {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }],
        deleted_at: { [Op.is]: null }
      },
      include: [{
        model: AuthIdentity,
        as: 'authIdentities',
        where: { provider: 'email_password', deleted_at: { [Op.is]: null } },
        required: false
      }]
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Account is not active');
    }

    const authIdentity = user.authIdentities?.[0];
    if (!authIdentity || !password) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const passwordHash = authIdentity.provider_metadata?.password_hash;
    if (!passwordHash) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    await user.update({ last_login_at: new Date() });

    return this.createSession(user.id);
  }

  async createSession(userId, deviceInfo = {}) {
    const sessionToken = jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ userId, type: 'refresh' }, config.JWT_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRES_IN });
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await AuthSession.create({
      id: generateUUID(),
      user_id: userId,
      session_token: sessionToken,
      refresh_token: refreshToken,
      status: 'active',
      expires_at: expiresAt,
      device_info: deviceInfo
    });

    // Get user with roles
    const user = await User.findByPk(userId, {
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

    return {
      user: userData,
      session,
      token: sessionToken,
      refreshToken
    };
  }

  async requestOtp(identifier, purpose = 'login') {
    const code = '123456'; // Mock OTP - always 123456
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Store code as plain text (not hashed) since it's a 6-digit code
    // In production, you'd generate a random 6-digit code
    const otp = await OtpCode.create({
      id: generateUUID(),
      phone: identifier.includes('@') ? null : identifier,
      email: identifier.includes('@') ? identifier : null,
      code: code, // Store as plain text for comparison
      status: 'pending',
      purpose,
      expires_at: expiresAt
    });

    return { code: config.OTP_DEBUG ? code : null, expiresAt };
  }

  async verifyOtp(identifier, code, purpose = 'login') {
    const otp = await OtpCode.findOne({
      where: {
        [Op.or]: [{ phone: identifier }, { email: identifier }],
        status: 'pending',
        purpose,
        expires_at: { [Op.gt]: new Date() }
      },
      order: [['created_at', 'DESC']]
    });

    if (!otp) {
      throw new UnauthorizedError('Invalid or expired OTP');
    }

    if (otp.attempts >= otp.max_attempts) {
      await otp.update({ status: 'expired' });
      throw new UnauthorizedError('OTP attempts exceeded');
    }

    await otp.update({ attempts: otp.attempts + 1 });

    // Compare OTP codes directly (plain text comparison for mock OTP)
    // In production, you might want to hash and compare, but for 6-digit codes, plain text is fine
    const valid = code === otp.code;
    if (!valid) {
      throw new UnauthorizedError('Invalid OTP');
    }

    await otp.update({ status: 'verified', verified_at: new Date() });

    let user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }],
        deleted_at: { [Op.is]: null }
      }
    });

    if (!user && purpose === 'login') {
      throw new UnauthorizedError('User not found');
    }

    if (!user && purpose === 'signup') {
      user = await this.signup({
        email: identifier.includes('@') ? identifier : null,
        phone: identifier.includes('@') ? null : identifier,
        first_name: 'User',
        last_name: 'Name'
      });
    }

    if (user) {
      await user.update({ last_login_at: new Date() });
    }

    return this.createSession(user.id);
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedError('Invalid token');
      }

      const session = await AuthSession.findOne({
        where: { refresh_token: refreshToken, status: 'active' }
      });

      if (!session) {
        throw new UnauthorizedError('Session not found');
      }

      await session.update({ status: 'revoked' });

      return this.createSession(decoded.userId);
    } catch (err) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async logout(sessionToken) {
    const session = await AuthSession.findOne({
      where: { session_token: sessionToken }
    });

    if (session) {
      await session.update({ status: 'revoked' });
    }
  }
}

module.exports = new AuthService();

