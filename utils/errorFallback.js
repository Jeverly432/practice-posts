export const errorFallback = (res, code, message) => {
  return res.status(code).json({
    message: message,
  })
}