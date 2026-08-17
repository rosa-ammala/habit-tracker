const defaultCorsOrigins = ["http://localhost:5173"];

export const jsonBodyLimit = process.env.JSON_BODY_LIMIT ?? "10kb";

export function getAllowedCorsOrigins() {
  const configuredOrigins = process.env.CORS_ORIGINS;

  if (!configuredOrigins) {
    return defaultCorsOrigins;
  }

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
