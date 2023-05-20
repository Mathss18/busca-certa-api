export default () => ({
  websiteUrl: process.env.WEBSITE_URL,
  jwtSecret: process.env.JWT_SECRET,
  database: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    rootUser: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_PASSWORD,
    rootPassword: process.env.MYSQL_ROOT_PASSWORD,
    url: process.env.DATABASE_URL,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
    transport: process.env.MAIL_TRANSPORT,
  },
  whatsapp: {
    accountId: process.env.WHATSAPP_ACCOUNT_ID,
    apiUrl: process.env.WHATSAPP_API_URL,
    apiToken: process.env.WHATSAPP_API_TOKEN,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
});
