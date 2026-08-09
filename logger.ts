import winston from 'winston';
import { env } from '../config/env';

export const logger = winston.createLogger({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    env.nodeEnv === 'production' ? winston.format.json() : winston.format.simple(),
  ),
  defaultMeta: { service: 'freclean-api' },
  transports: [new winston.transports.Console()],
});
