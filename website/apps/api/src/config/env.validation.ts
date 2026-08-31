type EnvShape = {
  PORT?: string;
  APP_URL?: string;
  DATABASE_URL?: string;
  REDIS_URL?: string;
  ELASTICSEARCH_URL?: string;
  ML_SERVICE_URL?: string;
  JWT_SECRET?: string;
  JWT_EXPIRES_IN?: string;
  ADMIN_SEED_NAME?: string;
  ADMIN_SEED_EMAIL?: string;
  ADMIN_SEED_PASSWORD?: string;
};

export function validateEnv(config: EnvShape): EnvShape {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'] as const;

  for (const key of requiredVars) {
    if (!config[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return config;
}
