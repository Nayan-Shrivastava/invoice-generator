const { format, createLogger, transports } = require('winston');
const { timestamp, combine, errors, printf } = format;

const logFormat = printf(({ level, timestamp, message, stack }) => {
	return `${timestamp}  ${level}  ${message || stack}`;
});

const logger = createLogger({
	format: combine(timestamp(), errors({ stack: true }), logFormat, format.colorize()),
	transports: [
		new transports.File({ filename: 'logs/complete.log' }),
		new transports.File({ filename: 'logs/error.log', level: 'error' })
	]
});

const logHandler = {
	log(level, message) {
		logger.log({ level, message });
	},
	error(level, message) {
		logger.error({ level, message });
	}
};

module.exports = {logger: logHandler};
