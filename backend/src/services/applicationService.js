const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

async function applyForJob(jobId, { coverLetter, resume }, user) {
	const job = await Job.findById(jobId);
	if (!job) {
		const err = new Error('Job not found');
		err.status = 404;
		throw err;
	}
	if (!job.isActive) {
		const err = new Error('Job is not accepting applications');
		err.status = 400;
		throw err;
	}
	const applicant = await User.findById(user.id);
	const applicantName = applicant?.name || 'Unknown';
	try {
		const application = await Application.create({
			job: jobId,
			applicant: user.id,
			applicantName,
			coverLetter,
			resume,
			status: 'pending',
			appliedDate: new Date(),
		});
		return application.toPublicJSON();
	} catch (e) {
		if (e && e.code === 11000) {
			const err = new Error('You have already applied for this job');
			err.status = 400;
			throw err;
		}
		throw e;
	}
}

async function getApplicationsForJob(jobId, employerId) {
	const job = await Job.findById(jobId);
	if (!job) {
		const err = new Error('Job not found');
		err.status = 404;
		throw err;
	}
	if (String(job.postedBy) !== String(employerId)) {
		const err = new Error('Forbidden');
		err.status = 403;
		throw err;
	}
	const apps = await Application.find({ job: jobId }).sort({ createdAt: -1 });
	return apps.map((a) => a.toPublicJSON());
}

async function getUserApplications(userId) {
	const apps = await Application.find({ applicant: userId }).sort({ createdAt: -1 });
	return apps.map((a) => a.toPublicJSON());
}

async function updateApplicationStatus(applicationId, status, employerId) {
	const app = await Application.findById(applicationId).populate('job');
	if (!app) {
		const err = new Error('Application not found');
		err.status = 404;
		throw err;
	}
	if (String(app.job.postedBy) !== String(employerId)) {
		const err = new Error('Forbidden');
		err.status = 403;
		throw err;
	}
	app.status = status;
	await app.save();
	return app.toPublicJSON();
}

module.exports = { applyForJob, getApplicationsForJob, getUserApplications, updateApplicationStatus };
