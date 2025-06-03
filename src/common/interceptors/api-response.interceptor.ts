import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/common/types/api-response.type';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data: any) => ({
        ...data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}
