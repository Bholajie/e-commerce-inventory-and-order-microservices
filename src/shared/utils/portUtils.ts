import { createServer } from 'net';

export const checkPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = createServer()
      .listen(port, () => {
        server.close();
        resolve(true);
      })
      .on('error', () => {
        resolve(false);
      });
  });
};

export const findAvailablePort = async (preferredPort: number, fallbackPorts: number[]): Promise<number> => {
  // First try the preferred port
  if (await checkPortAvailable(preferredPort)) {
    return preferredPort;
  }

  // Try fallback ports
  for (const port of fallbackPorts) {
    if (await checkPortAvailable(port)) {
      return port;
    }
  }

  throw new Error('No available ports found');
};