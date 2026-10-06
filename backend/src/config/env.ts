export function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function getPort(name: string): number {
  const value = getEnv(name);
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      `Environment variable ${name} must be a integer between 1 and 65535`,
    );
  }
  return port;
}
