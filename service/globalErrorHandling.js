
let mode = process.env.MODE

export const globalErrorHandel = (err, req, res, next) => {
    if (mode) {
        devMode()
    } else {
        prodMode()
    }
}

const prodMode = (err, req, res) => {
    let code = err.statusCode || 400;
    res.status(code).json({ message: err.message });
}
const devMode = (err, req, res) => {
    let code = err.statusCode || 400;
    res.status(code).json({ message: err.message, stack: err.stack });
}