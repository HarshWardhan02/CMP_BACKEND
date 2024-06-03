export class DatabaseException extends Error {
  constructor(message: string, error?: Error) {
    super(message);
  }
}
