export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} is required`);
  }
  return value.trim();
}

export function requireNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new HttpError(400, `${fieldName} must be a valid number`);
  }
  return value;
}

export function requireStringArray(value: unknown, fieldName: string): string[] {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== "string" || item.trim().length === 0)) {
    throw new HttpError(400, `${fieldName} must be a non-empty string array`);
  }

  return value.map((item) => item.trim());
}

export function requireOneOf<T extends string>(value: unknown, fieldName: string, allowed: readonly T[]): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new HttpError(400, `${fieldName} must be one of: ${allowed.join(", ")}`);
  }
  return value as T;
}
