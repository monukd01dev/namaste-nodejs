const throwValidationError = message =>{
    const err = new Error(message);
    err.name = "ValidationError";
    throw err
}

module.exports = throwValidationError;