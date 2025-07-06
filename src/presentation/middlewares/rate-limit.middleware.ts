import rateLimit from 'express-rate-limit';


// under development mode increased max count for request , will be stricter in production !!
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // General limit for all requests
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
});

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: {
    success: false,
    message: "API rate limit exceeded. Please try again later.",
  },
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Very strict for login attempts
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  skipSuccessfulRequests: true, 
});

export const registrationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Only 15 registrations per hour per IP
  message: {
    success: false,
    message: "Registration limit exceeded. Please try again later.",
  },
});

export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 3 password reset attempts per hour
  message: {
    success: false,
    message: "Too many password reset attempts. Please try again later.",
  },
});

export const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Lower limit for admin operations
  message: {
    success: false,
    message: "Admin rate limit exceeded.",
  },
});

export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 file uploads per hour
  message: {
    success: false,
    message: "File upload limit exceeded. Please try again later.",
  },
});
