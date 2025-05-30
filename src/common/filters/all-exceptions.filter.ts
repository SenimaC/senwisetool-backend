import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('EXCEPTION');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Erreur interne du serveur';

    const error =
      exception instanceof HttpException
        ? ((exception.getResponse() as any)?.message ?? message)
        : ((exception as any)?.message ?? 'Erreur inattendue');

    this.logger.error(
      `❌ [${status}] ${message} | ${request.method} ${request.url}\n` +
        `→ IP: ${request.ip}\n→ Params: ${JSON.stringify(request.params)}\n→ Body: ${JSON.stringify(request.body)}\n→ Error: ${error}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
