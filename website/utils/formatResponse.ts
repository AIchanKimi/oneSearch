export function formatResponse<T>(data: T, message: string, code: number = 0) {
  return {
    data,
    message,
    code,
  }
}
