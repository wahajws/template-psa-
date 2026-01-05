function success(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function error(res, message = 'Error', statusCode = 500, code = null, errors = null) {
  const response = {
    success: false,
    message,
    code: code || 'ERROR'
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
}

function paginated(res, data, pagination, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination
  });
}

module.exports = {
  success,
  error,
  paginated
};



