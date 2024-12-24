export interface FieldError {
  field: string;
  message: string;
}

export class AppError extends Error {
  statusCode: number;
  errors: FieldError[] | string;
  info?: string; // extra details about the error condition
  constructor(
    statusCode: number,
    errors: string | Array<FieldError>,
    info?: string
  ) {
    const errorMessage = Array.isArray(errors)
      ? errors.map((e) => `${e.field}: ${e.message}`).join(", ")
      : errors;
    super(errorMessage);
    this.statusCode = statusCode;
    this.errors = errors;

    // super(errorMessage);
    // this.statusCode = statusCode;
    // this.info = info;
  }
}
