const messageList = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
};

class HttpError extends Error {
  constructor(
    statusName,
    message = messageList[errorStatusMap[statusName]],
    details = {}
  ) {
    super(message);
    this.status = errorStatusMap[statusName] || 500;
    this.details = details;
  }
}

export default HttpError;
