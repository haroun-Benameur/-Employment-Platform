const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

function authenticate(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ')
		? authHeader.substring(7)
		: null;
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: payload.sub, role: payload.role };
		if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
			return res.status(401).json({ message: 'Invalid token subject' });
		}
		return next();
	} catch (e) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}

function requireRole(...roles) {
	return function roleMiddleware(req, res, next) {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		next();
	};
}

module.exports = { authenticate, requireRole };
