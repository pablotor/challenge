/* eslint-disable max-classes-per-file */

export class MissingEnvParamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class FileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
