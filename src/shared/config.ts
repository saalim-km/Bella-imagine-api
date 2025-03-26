import dotenv from "dotenv";
dotenv.config();

export const config = {
  // database configuration
  database: {
    URI: process.env.DATABASE_URI || "mongodb://localhost:27017/zyra-moments",
  },

  // cors configuration
  cors: {
    ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:5173",
  },

  // Server Configuration
  server: {
    HOST: process.env.HOST || "localhost",
    PORT: process.env.PORT || 5000,
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

  cloudinary : {
    CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET
  }
};
