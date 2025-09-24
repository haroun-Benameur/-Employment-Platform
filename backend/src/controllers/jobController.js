const { body, param } = require('express-validator');
const { asyncHandler } = require('../utils/asyncHandler');
const { listJobs, getJobById, createJob, updateJob, deleteJob } = require('../services/jobService');

const createValidators = [
	body('title').isString().trim().notEmpty(),
	body('company').isString().trim().notEmpty(),
	body('location').isString().trim().notEmpty(),
	body('description').isString().trim().notEmpty(),
	body('requirements').optional().isArray(),
	body('salary').optional().isString(),
	body('type').isIn(['full-time', 'part-time', 'contract', 'internship']),
];

const idParam = [param('id').isMongoId()];

const getAll = asyncHandler(async (req, res) => {
	const jobs = await listJobs();
	res.json(jobs);
});

const getOne = asyncHandler(async (req, res) => {
	const job = await getJobById(req.params.id);
	res.json(job);
});

const create = asyncHandler(async (req, res) => {
	const job = await createJob(req.body, req.user.id);
	res.status(201).json(job);
});

const update = asyncHandler(async (req, res) => {
	const job = await updateJob(req.params.id, req.body, req.user.id);
	res.json(job);
});

const remove = asyncHandler(async (req, res) => {
	await deleteJob(req.params.id, req.user.id);
	res.status(204).send();
});

module.exports = { createValidators, idParam, getAll, getOne, create, update, remove };
