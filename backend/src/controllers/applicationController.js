const { body, param } = require('express-validator');
const { asyncHandler } = require('../utils/asyncHandler');
const { applyForJob, getApplicationsForJob, getUserApplications, updateApplicationStatus } = require('../services/applicationService');

const applyValidators = [
	body('jobId').isMongoId(),
	body('coverLetter').optional().isString(),
	body('resume').optional().isString(),
];

const jobIdParam = [param('jobId').isMongoId()];
const appIdParam = [param('id').isMongoId()];

const apply = asyncHandler(async (req, res) => {
	const { jobId, coverLetter, resume } = req.body;
	const app = await applyForJob(jobId, { coverLetter, resume }, req.user);
	res.status(201).json(app);
});

const listForJob = asyncHandler(async (req, res) => {
	const apps = await getApplicationsForJob(req.params.jobId, req.user.id);
	res.json(apps);
});

const listForMe = asyncHandler(async (req, res) => {
	const apps = await getUserApplications(req.user.id);
	res.json(apps);
});

const updateStatusValidators = [
	body('status').isIn(['pending', 'reviewed', 'interview', 'hired', 'rejected'])
];

const updateStatus = asyncHandler(async (req, res) => {
	const updated = await updateApplicationStatus(req.params.id, req.body.status, req.user.id);
	res.json(updated);
});

module.exports = { apply, applyValidators, listForJob, listForMe, jobIdParam, appIdParam, updateStatus, updateStatusValidators };
