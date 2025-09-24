const { body } = require('express-validator');
const { asyncHandler } = require('../utils/asyncHandler');
const { registerUser, loginUser, createResetToken, resetPassword } = require('../services/authService');

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

const forgotValidators = [body('email').isEmail().normalizeEmail()];
const forgotPassword = asyncHandler(async (req, res) => {
	const result = await createResetToken(req.body.email);
	res.json({ ok: true }); // Do not leak token in response in production
});

const resetValidators = [
	body('token').isString().notEmpty(),
	body('password').isString().isLength({ min: 6 }),
];
const resetPasswordController = asyncHandler(async (req, res) => {
	await resetPassword(req.body.token, req.body.password);
	res.json({ ok: true });
});

module.exports = { register, login, me, registerValidators, loginValidators, forgotPassword, forgotValidators, resetPasswordController, resetValidators };
