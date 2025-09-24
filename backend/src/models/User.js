const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ['jobseeker', 'employer'], required: true, default: 'jobseeker' },
		company: { type: String },
		title: { type: String },
		skills: { type: [String], default: [] },
		about: { type: String },
		resetPasswordToken: { type: String },
		resetPasswordExpires: { type: Date },
	},
	{ timestamps: true }
);

userSchema.methods.toPublicJSON = function toPublicJSON() {
	return {
		id: String(this._id),
		name: this.name,
		email: this.email,
		role: this.role,
		company: this.company,
		title: this.title,
		skills: this.skills,
		about: this.about,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
	};
};

module.exports = mongoose.model('User', userSchema);
