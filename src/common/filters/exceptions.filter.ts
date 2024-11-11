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
import { EntityMetadataNotFoundError } from 'typeorm';

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ExceptionsFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        console.log(exception)
        const status = exception.getStatus();

        if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
            return response.status(status).json(exception.getResponse());
        }

        if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(exception);
        }

        return response.status(status).json({
            status_code: status,
            message: exception?.message,
            created_at: new Date().toISOString(),
        });
    }

}