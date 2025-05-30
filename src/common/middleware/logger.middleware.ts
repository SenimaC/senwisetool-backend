import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, params, query } = req;
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip;

    const start = Date.now();

    res.on('finish', () => {
      const delay = Date.now() - start;

      this.logger.log(
        `${method} ${originalUrl} [${res.statusCode}] - ${delay}ms\n` +
          `→ IP: ${ip}\n→ Agent: ${userAgent}\n→ Params: ${JSON.stringify(params)}\n→ Query: ${JSON.stringify(query)}\n→ Body: ${JSON.stringify(body)}`,
      );
    });

    next();
  }
}
