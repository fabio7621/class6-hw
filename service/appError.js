const appError = (httpStatus, errMessage, next) => {
	const error = new Error(errMessage);
	error.statusCode = httpStatus;
	error.isOperational = true; //這個錯誤是預期的嗎？是的
	return error;
};

module.exports = appError;
