const { validationResult } = require('express-validator');

function validate(req, res, next) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ message: 'Validation failed', details: result.array() });
	}
	next();
}

module.exports = { validate };
