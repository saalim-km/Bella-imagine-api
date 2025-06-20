import { INVALID } from "zod";

export type TRole = "client" | "vendor" | "admin";

export type TStatus = "blocked" | "unblocked";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const SUCCESS_MESSAGES = {
  LEAVE_SUCCESS : 'Community Leaved',
  CATEGORY_JOIN_REQUEST_SUCCESS: "Category join request sent successfully.",
  CLIENT_SECRET_SUCCESS: "Client secret generated successfully.",
  REFRESH_TOKEN_SUCCESS : "Access token created successfully",
  OTP_VERIFY_SUCCESS : 'OTP verified successfully',
  JOINED_SUCESS :"Joined",
  BOOKING_SUCCESS: "Booking completed.",
  CREATED: "Created successfully.",
  LOGIN_SUCCESS: "Login successful.",
  REGISTRATION_SUCCESS: "Registration completed successfully.",
  OTP_SEND_SUCCESS: "OTP sent successfully",
  LOGOUT_SUCCESS: "Logged out successfully.",
  UPDATE_SUCCESS: "Updated successfully.",
  DELETE_SUCCESS: "Deleted successfully.",
  OPERATION_SUCCESS: "Operation completed successfully.",
  PASSWORD_RESET_SUCCESS: "Password reset successfully.",
  VERIFICATION_SUCCESS: "Verification completed successfully.",
  DATA_RETRIEVED: "Data retrieved successfully.",
  ACTION_SUCCESS: "Action performed successfully.",
};

export const ERROR_MESSAGES = {
  CATEGORY_ALREADY_ADDED_IN_PROFILE : 'Category already added in profile',
  WORKSMAPLE_NOT_FOUND : 'Worksample not found',
  REGISTERATION_FAILED : 'Registeration failed',
  SOCKET_NOT_INITIAZIDE : 'Socket not initialized',
  DIDNT_JOINED_COMMUNITY : "Didn't joined community yet",
  ALREADY_MEMBER : 'Already a member of this community',
  INVALID_SLUG : 'Invalid slug',
  COMMUNIY_EXISTS : 'Community already exists.',
  ADMIN_NOT_FOUND: "Admin not found",
  INVALID_AMOUNT: "Invalid amount provided.",
  UNAUTHORIZED_USER: "Unauthorized user.",
  INVALID_BOOKING_STATUS: "Invalid booking status provided.",
  PAYMENT_INTENT_CREATION_FAILED: "Failed to create payment intent, please try again later.",
  WALLET_NOT_FOUND: "Wallet not found",
  BOOKING_ALREADY_COMPLETED_OR_CANCELLED: "Booking already completed or cancelled", 
  CATEGORY_JOIN_REQUEST_LIMIT:' You can only join up to 3 categories',
  CATEGORY_JOIN_REQUEST_EXISTS: "Category join request already exists",
  FAILED_TO_CREATE_PAYMENT: "Failed to create payment, please try again later.",
  PAYMENT_FAILED : 'Failed to process payment, server is down please try again layer',
  SERVICE_NOT_FOUND : 'Service not found',
  USER_BLOCKED : "User blocked by admin",
  OTP_EXPIRED : 'OTP expired',
  PASSWORD_REQUIRED : "Password is required",
  USER_LOGIN_WITHOUT_PASSWORD : 'The email address you entered is already registered with Google. Please log in using Google, or use a different email to continue.',
  VENDOR_NOT_FOUND : 'Vendor Not Found',
  COMMUNITY_NO_EXIST : "Community didn't exist",
  NO_SUCH_DATA: "No such data found.",
  INVALID_OTP: "Invalid OTP",
  INVALID_PASSWORD: "Invalid password",
  INVALID_ROLE: "Invalid Role",
  CONTEST_NOT_FOUND: "Contest not found",
  ALREADY_EXISTS: "Already exists",
  MISSING_REQUIRED_FIELDS: "Required fields are missing",
  NO_CHARGE_FOUND: "No charge found for this payment",
  CONFIRM_PAYMENT_FAILED: "Failed to confirm payment",
  FAILED_TO_PROCESS_REFUND: "Failed to process refund",
  WRONG_ID: "Wrong ID",
  ID_REQUIRED: "ID required",
  TOKEN_EXPIRED: "Token Expired",
  EMAIL_NOT_FOUND: "Email Not Found",
  BOOKING_NOT_FOUND: "Booking Not Found",
  ID_NOT_PROVIDED: "Id Not Provided",
  FORBIDDEN:
    "Access denied. You do not have permission to access this resource.",
  BLOCKED: "Access denied: Your account has been blocked.",
  NOT_ALLOWED: "You are not allowed",
  EMAIL_EXISTS: "Email Already Exists",
  REQUEST_NOT_FOUND: "Category Request Not Found",
  CATEGORY_EXISTS: "Category Already Exists",
  CATEGORY_NOT_FOUND: "Category Not Found",
  INVALID_TOKEN: "Invalid token",
  INVALID_CREDENTIALS: "Invalid credentials provided.",
  INVALID_DATAS : "Didn't meet the required data to update",
  USER_NOT_FOUND: "User not found.",
  UNAUTHORIZED_ACCESS: "Unauthorized access.",
  SERVER_ERROR: "An error occurred, please try again later.",
  VALIDATION_ERROR: "Validation error occurred.",
  MISSING_PARAMETERS: "Missing required parameters.",
  WRONG_CURRENT_PASSWORD: "Current password is wrong",
  SAME_CURR_NEW_PASSWORD: "Please enter a different password from current",
  INVALID_BOOKING_DATE: "The requested booking date is not available",
  INVALID_TIME_SLOT: "The requested time slot is not available",
  TIME_SLOT_FULL: "The requested time slot is already at full capacity",
  ROUTE_NOT_FOUND: "Route not found.",
};

const EMAIL_WRAPPER = (content: string) => `
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 30px; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #333; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);">
    ${content}
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px;" />
    <p style="font-size: 12px; color: #999; text-align: center;">
      This email was sent from an unmonitored address. Please do not reply to this message.
    </p>
  </div>
`;

export const VERIFICATION_MAIL_CONTENT = (otp: string) =>
  EMAIL_WRAPPER(`
    <h1 style="color: #1F2122; font-size: 24px; margin-bottom: 16px;">Welcome to Bella Imagine 🎉</h1>
    <p style="font-size: 16px; line-height: 1.6;">Thank you for signing up with <strong>Bella Imagine</strong>. To complete your registration, please verify your email address with the following code:</p>
    <div style="text-align: center; margin: 32px 0;">
      <span style="display: inline-block; font-size: 28px; font-weight: 600; background-color: #f9f9f9; color: #1F2122; padding: 14px 24px; border-radius: 8px; letter-spacing: 2px;">
        ${otp}
      </span>
    </div>
    <p style="font-size: 16px; line-height: 1.6;">With Bella Imagine, you can explore, organize, and attend amazing events seamlessly.</p>
    <p style="font-size: 16px; line-height: 1.6;">If this wasn’t you, please ignore this email or contact our support team.</p>
    <p style="margin-top: 24px; font-size: 16px;">Cheers,<br /><strong>The Bella Imagine Team</strong></p>
`);

export const CATEGORY_APPROVED_MAIL_CONTENT = (categoryName: string) =>
  EMAIL_WRAPPER(`
    <h1 style="color: #0a74da; font-size: 22px; margin-bottom: 16px;">Category Approved ✅</h1>
    <p style="font-size: 16px; line-height: 1.6;">Good news! Your request for the category <strong>${categoryName}</strong> has been approved by the <strong>Bella Imagine</strong> team.</p>
    <p style="font-size: 16px; line-height: 1.6;">You can now start adding services or listings under this category.</p>
    <p style="font-size: 16px; line-height: 1.6;">If you need any help, don’t hesitate to reach out to us.</p>
    <p style="margin-top: 24px; font-size: 16px;">Best regards,<br /><strong>The Bella Imagine Team</strong></p>
`);

export const RESET_PASSWORD_MAIL_CONTENT = (otp: string) =>
  EMAIL_WRAPPER(`
    <h1 style="color: #0a74da; font-size: 22px; margin-bottom: 16px;">Reset Your Password</h1>
    <p style="font-size: 16px; line-height: 1.6;">We received a request to reset your <strong>Bella Imagine</strong> account password.</p>
    <p style="font-size: 16px; line-height: 1.6;">Use the OTP code below to proceed:</p>
    <div style="text-align: center; margin: 32px 0;">
      <span style="display: inline-block; font-size: 28px; font-weight: 600; background-color: #f9f9f9; color: #1F2122; padding: 14px 24px; border-radius: 8px; letter-spacing: 2px;">
        ${otp}
      </span>
    </div>
    <p style="font-size: 16px; line-height: 1.6;">This code is valid for a limited time. If you didn’t request this, simply ignore the message.</p>
    <p style="margin-top: 24px; font-size: 16px;">Stay safe,<br /><strong>The Bella Imagine Team</strong></p>
`);