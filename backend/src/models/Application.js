const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
	{
		job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
		applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		applicantName: { type: String, required: true },
		coverLetter: { type: String },
		resume: { type: String },
		status: { type: String, enum: ['pending', 'reviewed', 'interview', 'hired', 'rejected'], default: 'pending' },
		appliedDate: { type: Date, default: () => new Date() },
	},
	{ timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

applicationSchema.methods.toPublicJSON = function toPublicJSON() {
	return {
		id: String(this._id),
		jobId: String(this.job),
		applicantId: String(this.applicant),
		applicantName: this.applicantName,
		coverLetter: this.coverLetter,
		resume: this.resume,
		status: this.status,
		appliedDate: this.appliedDate?.toISOString?.() || this.appliedDate,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
	};
};

module.exports = mongoose.model('Application', applicationSchema);
