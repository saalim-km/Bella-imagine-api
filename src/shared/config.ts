import dotenv from 'dotenv';
dotenv.config()

export const config = {



    // database configuration
    database :  {
        URI : process.env.DATABASE_URI || "mongodb://localhost:27017/zyra-moments"
    },



    // cors configuration
    cors : {
        ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:5173",
    },


    // Server Configuration
  server: {
    HOST: process.env.HOST || "localhost",
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
  },


  nodemailer : {
    USER : process.env.EMAIL_USER,
    PASS : process.env.EMAIL_PASS
  }
}