import { ApiResponse } from 'src/common/types/api-response.type';

export function successResponse<T>(
  message = 'Succès',
  statusCode = 200,
  data?: T,
): ApiResponse<T> {
  return {
    data,
    statusCode,
    message,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

export function errorResponse(
  messageOrError: string | Error,
  errorType?: string,
  statusCode = 500,
): ApiResponse<null> {
  const timestamp = new Date().toISOString();

  if (typeof messageOrError === 'string') {
    return {
      data: null,
      message: messageOrError,
      statusCode,
      error: errorType || 'InternalServerError',
      success: false,
      timestamp,
    };
  }

  // Cas : objet Error ou exception
  return {
    data: null,
    message: messageOrError.message || 'Erreur inconnue',
    statusCode: (messageOrError as any).statusCode || 500,
    error: messageOrError.name || 'Error',
    success: false,
    timestamp,
  };
}
