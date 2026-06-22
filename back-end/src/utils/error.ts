/**
 * Application error helpers. Provides a typed AppError plus a small catalogue
 * of common HTTP error factories used across controllers.
 */
export class AppError extends Error {
  public readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

export const httpError = {
  badRequest: (message = 'Bad Request') => new AppError(message, 400),
  unauthorized: (message = 'Unauthorized') => new AppError(message, 401),
  forbidden: (message = 'Forbidden') => new AppError(message, 403),
  notFound: (message = 'Not Found') => new AppError(message, 404),
  unprocessable: (message = 'Unprocessable Entity') => new AppError(message, 422),
  internal: (message = 'Internal Server Error') => new AppError(message, 500),
};

export default httpError;
