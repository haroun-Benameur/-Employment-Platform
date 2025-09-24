const User = require('../models/User');

async function getUserById(id) {
	const user = await User.findById(id);
	if (!user) {
		const err = new Error('User not found');
		err.status = 404;
		throw err;
	}
	return user.toPublicJSON();
}

async function updateUser(id, updates) {
	const allowed = ['name', 'company', 'title', 'skills', 'about'];
	const set = {};
	for (const key of allowed) {
		if (typeof updates[key] !== 'undefined') set[key] = updates[key];
	}
	const user = await User.findByIdAndUpdate(id, set, { new: true });
	if (!user) {
		const err = new Error('User not found');
		err.status = 404;
		throw err;
	}
	return user.toPublicJSON();
}

module.exports = { getUserById, updateUser };
