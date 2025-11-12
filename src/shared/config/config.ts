import dotenv from "dotenv";
dotenv.config();

export const config = {
  // database configuration
  database: {
    URI: process.env.DATABASE_URI || "",
  },

  // cors configuration
  cors: {
    ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN || "https://bellaimagine.salimkm.online",
  },

  // Server Configuration
  server: {
    HOST: process.env.HOST || "localhost",
    PORT: process.env.PORT || 3002,
    NODE_ENV: process.env.NODE_ENV || "development",
  },


  // Nodemailer Configuration
  nodemailer: {
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
  },


  // JWT configuration
  jwt : {
    ACCESS_SECRET_KEY : process.env.JWT_ACCESS_SECRET_KEY || "your-secret-key",
    REFRESH_SECRET_KEY : process.env.JWT_REFRESH_SECRET_KEY || "your-refresh-key",
    ACCESS_EXPIRES_IN : process.env.JWT_ACCESS_EXPIRES_IN || "",
    REFRESH_EXPIRES_IN : process.env.JWT_REFRESH_EXPIRES_IN || ""
  },

  isProduction : {
    NODE_ENV : process.env.NODE_ENV || false
  },


  stripe : {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  },

  s3: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
    AWS_BUCKET_NAME : process.env.BUCKET_NAME || '',
    AWS_USERS_FOLDER : process.env.AWS_USERS_FOLDER || '',
    AWS_WORK_SAMPLES_FOLDER : process.env.AWS_WORK_SAMPLES_FOLDER || '',
      profile : 'user-avatar',
    community : 'community',
    communityPost : 'community-post',
    groupChatMedia: 'group-chat-media',
    privateChatMedia : 'private-chat-media',
    vendorDocuments : 'vendor-documents',
    workSample : 'worksample',
    chatMedia : 'private-chat-media'
  },

  redis : {
    REDIS_USERNAME : process.env.REDIS_USERNAME || '',
    REDIS_PASS : process.env.REDIS_PASS || '',
    REDIS_HOST : process.env.REDIS_HOST || '',
    REDIS_PORT : process.env.REDIS_PORT || '6379',
    REDIS_PRESIGNED_URL_EXPIRY : process.env.REDIS_PRESIGNRED_URL_EXPIRY ? parseInt(process.env.REDIS_PRESIGNRED_URL_EXPIRY, 10) || 86400 : 86400
  }
};
