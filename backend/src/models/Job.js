const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		company: { type: String, required: true, trim: true },
		location: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		requirements: { type: [String], default: [] },
		salary: { type: String },
		type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], required: true },
		postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		postedDate: { type: Date, default: () => new Date() },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

jobSchema.methods.toPublicJSON = function toPublicJSON() {
	return {
		id: String(this._id),
		title: this.title,
		company: this.company,
		location: this.location,
		description: this.description,
		requirements: this.requirements,
		salary: this.salary,
		type: this.type,
		postedBy: String(this.postedBy),
		postedDate: this.postedDate?.toISOString?.() || this.postedDate,
		isActive: this.isActive,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
	};
};

module.exports = mongoose.model('Job', jobSchema);
