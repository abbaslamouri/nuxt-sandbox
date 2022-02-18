import colors from 'colors'

export default (error) => {
  // console.log(colors.red.bold('ERR', error.message))
  let statusCode = 200
  let message = ''

  // Mongoose validation error
  if (error.errors) {
    for (const prop in error.errors) {
      const err = error.errors[prop]

      if (err.name === 'CastError') {
        message += `${err.message}.\n`
        statusCode = 400
      }

      if (err.name === 'ValidatorError') {
        message += `${err.message}.\n`
        statusCode = 400
      }
    }
  }

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    message += `Unable to find a document with this id: ${error.value}\n`
    statusCode = 404
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    const fieldValue = Object.values(error.keyValue)[0]
    message += `${
      field[0].toUpperCase() + field.substring(1)
    } must be unique.  A document with ${field} = ${fieldValue} exists in the database.\n`
    statusCode = 400
  }

  // ReferenceError error
  if (error.name === 'ReferenceError') {
    message += `${error.message}.<br>`
    statusCode = 400
  }

  // custom error
  if (error.customError) {
    message += `${error.message}.\n`
    statusCode = error.statusCode
  }

  // Sendgrid  error
  if (error.response) {
    // message += `${error.response}.\n`
    message += `We are not able to email registration tokens at thi time, please try again later\n`
    statusCode = 500
  }

  return {
    statusCode: statusCode || 500,
    errors: error.errors,
    status: 'error',
    message: message ? message : error.message ? error.message : 'Server error',
  }
}
