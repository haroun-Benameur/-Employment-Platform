const Job = require('../models/Job');

async function listJobs() {
	const jobs = await Job.find({}).sort({ createdAt: -1 });
	return jobs.map((j) => j.toPublicJSON());
}

async function getJobById(id) {
	const job = await Job.findById(id);
	if (!job) {
		const err = new Error('Job not found');
		err.status = 404;
		throw err;
	}
	return job.toPublicJSON();
}

async function createJob({ title, company, location, description, requirements, salary, type }, userId) {
	const job = await Job.create({
		title,
		company,
		location,
		description,
		requirements: Array.isArray(requirements) ? requirements : [],
		salary,
		type,
		postedBy: userId,
		postedDate: new Date(),
		isActive: true,
	});
	return job.toPublicJSON();
}

async function updateJob(id, updates, userId) {
	const job = await Job.findById(id);
	if (!job) {
		const err = new Error('Job not found');
		err.status = 404;
		throw err;
	}
	if (String(job.postedBy) !== String(userId)) {
		const err = new Error('Forbidden');
		err.status = 403;
		throw err;
	}
	const updatable = ['title', 'company', 'location', 'description', 'requirements', 'salary', 'type', 'isActive'];
	for (const key of updatable) {
		if (typeof updates[key] !== 'undefined') job[key] = updates[key];
	}
	await job.save();
	return job.toPublicJSON();
}

async function deleteJob(id, userId) {
	const job = await Job.findById(id);
	if (!job) {
		const err = new Error('Job not found');
		err.status = 404;
		throw err;
	}
	if (String(job.postedBy) !== String(userId)) {
		const err = new Error('Forbidden');
		err.status = 403;
		throw err;
	}
	await job.deleteOne();
}

module.exports = { listJobs, getJobById, createJob, updateJob, deleteJob };
