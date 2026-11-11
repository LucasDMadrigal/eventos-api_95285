export function sessionErrorHandler(err, req, res, next) {
    res.status(409).json({ message: err.message })
}