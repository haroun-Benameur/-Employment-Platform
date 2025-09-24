const { body } = require('express-validator');
const { asyncHandler } = require('../utils/asyncHandler');
const { registerUser, loginUser } = require('../services/authService');

const registerValidators = [
	body('name').isString().trim().notEmpty(),
	body('email').isEmail().normalizeEmail(),
	body('password').isString().isLength({ min: 6 }),
	body('role').isIn(['jobseeker', 'employer']),
];

const loginValidators = [
	body('email').isEmail().normalizeEmail(),
	body('password').isString().notEmpty(),
];

const register = asyncHandler(async (req, res) => {
	const result = await registerUser(req.body);
	res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
	const result = await loginUser(req.body);
	res.json(result);
});

const me = asyncHandler(async (req, res) => {
	res.json({ id: req.user.id, role: req.user.role });
});

module.exports = { register, login, me, registerValidators, loginValidators };
