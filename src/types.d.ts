declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CORS_ALLOWED_ORIGIN: string;
            DATABASE_URI: string;
            PORT: string;
            JWT_ACCESS_SECRET_KEY: string;
            JWT_REFRESH_SECRET_KEY: string;
            JWT_ACCESS_EXPIRES_IN: string;
            JWT_REFRESH_EXPIRES_IN: string;
            Multer : File
        }
    }
}