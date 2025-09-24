const express = require('express');
const { validate } = require('../middleware/validate');
const { authenticate, requireRole } = require('../middleware/auth');

const { register, login, me, registerValidators, loginValidators, forgotPassword, forgotValidators, resetPasswordController, resetValidators } = require('../controllers/authController');
const { getMe, updateMe, updateValidators, list, listValidators } = require('../controllers/userController');
const jobController = require('../controllers/jobController');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

// Auth
router.post('/auth/register', registerValidators, validate, register);
router.post('/auth/login', loginValidators, validate, login);
router.get('/auth/me', authenticate, me);
router.post('/auth/forgot-password', forgotValidators, validate, forgotPassword);
router.post('/auth/reset-password', resetValidators, validate, resetPasswordController);

// Users
router.get('/users', listValidators, validate, list);
router.get('/users/me', authenticate, getMe);
router.patch('/users/me', authenticate, updateValidators, validate, updateMe);

// Jobs
router.get('/jobs', jobController.getAll);
router.get('/jobs/:id', jobController.idParam, validate, jobController.getOne);
router.post('/jobs', authenticate, requireRole('employer'), jobController.createValidators, validate, jobController.create);
router.patch('/jobs/:id', authenticate, requireRole('employer'), jobController.idParam, jobController.createValidators.map(v => v.optional && v.optional()), validate, jobController.update);
router.delete('/jobs/:id', authenticate, requireRole('employer'), jobController.idParam, validate, jobController.remove);

// Applications
router.post('/applications', authenticate, requireRole('jobseeker'), applicationController.applyValidators, validate, applicationController.apply);
router.get('/applications/my', authenticate, applicationController.listForMe);
router.get('/jobs/:jobId/applications', authenticate, requireRole('employer'), applicationController.jobIdParam, validate, applicationController.listForJob);
router.patch('/applications/:id', authenticate, requireRole('employer'), applicationController.appIdParam, applicationController.updateStatusValidators, validate, applicationController.updateStatus);

module.exports = router;
