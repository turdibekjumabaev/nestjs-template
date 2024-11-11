import { HttpStatus, UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from 'class-validator'

export class ClassValidationPipe extends ValidationPipe {
    exceptionFactory = (errors: ValidationError[]) => {
        const result = errors.map((error) => ({
            property: error.property,
            message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new UnprocessableEntityException({
            status_code: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: result,
            created_at: new Date().toISOString(),
        });

    };
}