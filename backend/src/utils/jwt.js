const jwt = require('jsonwebtoken');

function signJwt(user) {
	const payload = { sub: String(user._id), role: user.role };
	const secret = process.env.JWT_SECRET;
	const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
	return jwt.sign(payload, secret, { expiresIn });
}

module.exports = { signJwt };
