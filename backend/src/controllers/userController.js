const { body, query } = require('express-validator');
const { asyncHandler } = require('../utils/asyncHandler');
const { getUserById, updateUser, listUsers } = require('../services/userService');

const updateValidators = [
	body('name').optional().isString().trim(),
	body('company').optional().isString().trim(),
	body('title').optional().isString().trim(),
	body('skills').optional().isArray(),
	body('about').optional().isString(),
];

const listValidators = [
	query('role').optional().isIn(['jobseeker', 'employer'])
];

const getMe = asyncHandler(async (req, res) => {
	const user = await getUserById(req.user.id);
	res.json(user);
});

const updateMe = asyncHandler(async (req, res) => {
	const user = await updateUser(req.user.id, req.body);
	res.json(user);
});

const list = asyncHandler(async (req, res) => {
	const users = await listUsers({ role: req.query.role });
	res.json(users);
});

module.exports = { getMe, updateMe, updateValidators, list, listValidators };
