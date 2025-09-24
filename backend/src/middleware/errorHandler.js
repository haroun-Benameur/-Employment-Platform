function notFoundHandler(req, res, next) {
	res.status(404).json({ message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
	const status = err.status || 500;
	const message = err.message || 'Internal Server Error';
	const details = err.details || undefined;
	if (process.env.NODE_ENV !== 'test') {
		// eslint-disable-next-line no-console
		console.error('[ERROR]', err);
	}
	res.status(status).json({ message, details });
}

module.exports = { notFoundHandler, errorHandler };
