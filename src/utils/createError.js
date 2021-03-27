import createError from 'http-errors';

const BadRequest = (error = 'BadRequest') => new createError(400, error);
const Unauthorized = (error = 'Unauthorized') => new createError(401, error);
const Forbidden = (error = 'Forbidden') => new createError(403, error);
const NotFound = (error = 'NotFound') => new createError(404, error);
const InternalServerError = (error = 'InternalServerError') => new createError(500, error);
const ServiceUnavailable = (error = 'ServiceUnavailable') => new createError(503, error);

export default {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  InternalServerError,
  ServiceUnavailable
};
