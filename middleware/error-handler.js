const errorHandlerMiddleware = (err, req, res, next) => {

    let customError = {
        statusCode: err.statusCode || 500,
        msg: err.message || "Something went wrong 😣. Please try again later."
    }

    if (err.name === "ValidationError") {
        customError.statusCode = 400;
        customError.msg = `Please provide values for: ${Object.keys(err.errors).join(", ")}.`
    }

    if (err.name === "CastError") {
        customError.statusCode = 404;
        customError.msg = `Job with id ${err.value} not found!`
    }

    if (err.code && err.code === 11000) {
        customError.statusCode = 400;
        customError.msg = `Duplicate value for: ${Object.keys(err.keyValue).join(" ")}. Please enter another value.`
    }
    
    return res.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = errorHandlerMiddleware;