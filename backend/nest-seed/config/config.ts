export const config = (): any => ({
  port: process.env.PORT,
  contextPath: 'api/v1',
  enableMetaData: true,
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
  },
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: ['./modules/**/*.entity.ts'],
    autoLoadEntities: true,
    keepConnectionAlive: true,
  },
  jwt: {
    secret: 'hard!to-guess_secret',
    accessTokenOptions: { expiresIn: 18000 },
    refreshTokenOptions: { expiresIn: 1210000, path: '/auth/refresh' },
    grantTypes: { accessGrant: 'access', refreshGrant: 'refresh' },
  },
  bcrypt: {
    saltRounds: 10,
  },
  swagger: {
    isEnabled: true,
    uiPath: '/swagger-ui',
    authUsers: {
      root: 'toor',
      admin: 'admin@123',
    },
  },
  morgan: {
    format: ':method, :url, :status, :response-time, :total-time,:http-version, :remote-addr, :user-agent',
  },
  roleBasedAccess: [
    {
      role: 'SUPER_ADMIN',
      permissions: [{ resource: '*', action: '*' }],
    },
    {
      role: 'ADMIN',
      permissions: [
        { resource: 'user', action: '*' },
        { resource: 'task', action: '*' },
      ],
    },
    {
      role: 'MEMBER',
      permissions: [
        { resource: 'user', action: 'get' },
        { resource: 'task', action: '*' },
      ],
    },
  ],
});
