import { loadConfig } from './config/config.js';
import { buildServer } from './server.js';

const config = loadConfig();
const server = buildServer();

try {
  await server.listen({ host: config.host, port: config.port });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
