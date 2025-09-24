const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { signJwt } = require('../utils/jwt');

async function registerUser({ name, email, password, role, company, title }) {
	const existing = await User.findOne({ email });
	if (existing) {
		const err = new Error('Email already registered');
		err.status = 400;
		throw err;
	}
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await User.create({ name, email, passwordHash, role, company, title });
	const token = signJwt(user);
	return { user: user.toPublicJSON(), token };
}

async function loginUser({ email, password }) {
	const user = await User.findOne({ email });
	if (!user) {
		const err = new Error('Invalid credentials');
		err.status = 401;
		throw err;
	}
	const match = await bcrypt.compare(password, user.passwordHash);
	if (!match) {
		const err = new Error('Invalid credentials');
		err.status = 401;
		throw err;
	}
	const token = signJwt(user);
	return { user: user.toPublicJSON(), token };
}

async function createResetToken(email) {
	const user = await User.findOne({ email });
	if (!user) {
		// Do not reveal account existence
		return { ok: true };
	}
	const token = crypto.randomBytes(24).toString('hex');
	const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
	user.resetPasswordToken = token;
	user.resetPasswordExpires = expires;
	await user.save();
	return { ok: true, token }; // In real app, email this token
}

async function resetPassword(token, newPassword) {
	const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
	if (!user) {
		const err = new Error('Invalid or expired token');
		err.status = 400;
		throw err;
	}
	user.passwordHash = await bcrypt.hash(newPassword, 10);
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	await user.save();
	return { ok: true };
}

module.exports = { registerUser, loginUser, createResetToken, resetPassword };
