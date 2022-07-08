// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set defaults 
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || `Something went wrong try again later`
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'CastError') {
    customError.msg = `No item found with Id : ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',');
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `We already have a account for this ${Object.keys(err.keyValue)} ,Please try to register with another email or you can login with that (${err.keyValue[Object.keys(err.keyValue)]}) email. `
    customError.statusCode = 400
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })

}

module.exports = errorHandlerMiddleware
