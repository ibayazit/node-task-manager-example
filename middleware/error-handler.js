const errorHandlerMiddleware = (err, req, res, next) => {
    const message = err.message || 'Something went wrong, try again later.',
        statusCode = err.statusCode || 500,
        response = { message }

    if (err.errors) {
        let { ...validationErrors } = err.errors

        validationErrors = Object.values(validationErrors).map((e, i) => {
            return {
                property: Object.keys(validationErrors)[i],
                message: e.message
            }
        })

        response.errors = validationErrors
    }

    return res.status(statusCode).json(response)
}

module.exports = errorHandlerMiddleware