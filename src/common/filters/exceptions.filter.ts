import { BaseExceptionFilter } from '@nestjs/core';
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ExceptionsFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        if (httpStatus === HttpStatus.UNPROCESSABLE_ENTITY) {
            return response.status(httpStatus).json(exception.getResponse());
        }

        if (httpStatus == HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(exception);
        }

        const responseBody = {
            status_code: httpStatus,
            message: exception?.message,
            created_at: new Date().toISOString(),
        }

        return response.status(httpStatus).json(responseBody);

    }

}