const bcrypt = require('bcryptjs');
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

module.exports = { registerUser, loginUser };
