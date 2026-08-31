export const appConfig = () => ({
  app: {
    name: 'MK Fashion API',
    port: parseInt(process.env.PORT ?? '4000', 10),
    url: process.env.APP_URL ?? 'http://localhost:3000',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  },
  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL ?? 'http://localhost:9200',
  },
  mlService: {
    url: process.env.ML_SERVICE_URL ?? 'http://localhost:8000',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'replace-with-a-long-random-string',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  adminSeed: {
    name: process.env.ADMIN_SEED_NAME ?? 'MK Admin',
    email: process.env.ADMIN_SEED_EMAIL ?? 'admin@mkfashion.in',
    password: process.env.ADMIN_SEED_PASSWORD ?? 'mkfashion2026',
  },
});
