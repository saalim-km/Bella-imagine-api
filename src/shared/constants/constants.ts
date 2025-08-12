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
  PAYMENT_STATUS_UPDATED : 'Payment status updated successfully',
  COMMENT_DELETED: "Comment has been deleted successfully.",
  COMMENT_EDITED: "Comment has been edited successfully.",
  SERVICE_DELETED: 'Service has been successfully deleted',
  WORKSAMPLE_DELETED: 'WorkSample has been successfully deleted',
  COMMENT_CREATED: "Your comment has been added.",
  LEAVE_SUCCESS: "You have left the community successfully.",
  CATEGORY_JOIN_REQUEST_SUCCESS: "Your request to join the category has been submitted.",
  CLIENT_SECRET_SUCCESS: "Client secret generated successfully.",
  REFRESH_TOKEN_SUCCESS: "Session refreshed. You're all set.",
  OTP_VERIFY_SUCCESS: "OTP verified successfully.",
  JOINED_SUCESS: "You've joined successfully.",
  BOOKING_SUCCESS: "Your booking is confirmed.",
  CREATED: "Successfully created.",
  LOGIN_SUCCESS: "You’re signed in.",
  REGISTRATION_SUCCESS: "Account registered successfully.",
  OTP_SEND_SUCCESS: "OTP has been sent to your email.",
  LOGOUT_SUCCESS: "You’ve been logged out.",
  UPDATE_SUCCESS: "Changes saved successfully.",
  DELETE_SUCCESS: "Item deleted successfully.",
  OPERATION_SUCCESS: "The operation was completed successfully.",
  PASSWORD_RESET_SUCCESS: "Your password has been reset.",
  VERIFICATION_SUCCESS: "Verification completed.",
  DATA_RETRIEVED: "Data retrieved successfully.",
  ACTION_SUCCESS: "Action completed successfully.",
};

export const ERROR_MESSAGES = {
  TOKEN_BLACKLISTED : "Access token is blacklisted. Please log in again.",
  TIME_SLOT_FULLY_BOOKED : "Capacity exceed for selected time slot",
  COMMENT_NOT_EXISTS : 'Comment not exists',
  WORKSMAPLE_LINKED: 'Some work samples are linked to this service and it cannot be deleted.',
  POST_NOT_EXISTS: 'Post does not exist.',
  POST_CREATION_FAILED: 'Failed to create post. Please try again later.',
  ENOUGH_DATA_TO_CREATE_NOTIFICATION: 'Insufficient data to create notification.',
  CATEGORY_ALREADY_ADDED_IN_PROFILE: 'Category is already added to the profile.',
  WORKSMAPLE_NOT_FOUND: 'Work sample not found.',
  REGISTERATION_FAILED: 'Registration failed.',
  SOCKET_NOT_INITIAZIDE: 'Socket is not initialized.',
  DIDNT_JOINED_COMMUNITY: "You haven't joined the community yet.",
  ALREADY_MEMBER: 'You are already a member of this community.',
  INVALID_SLUG: 'Invalid slug provided.',
  COMMUNIY_EXISTS: 'Community already exists.',
  ADMIN_NOT_FOUND: 'Admin not found.',
  INVALID_AMOUNT: 'Invalid amount provided.',
  UNAUTHORIZED_USER: 'Unauthorized user.',
  INVALID_BOOKING_STATUS: 'Invalid booking status.',
  PAYMENT_INTENT_CREATION_FAILED: 'Failed to create payment intent. Please try again later.',
  WALLET_NOT_FOUND: 'Wallet not found.',
  BOOKING_ALREADY_COMPLETED_OR_CANCELLED: 'Booking has already been completed or cancelled.',
  CATEGORY_JOIN_REQUEST_LIMIT: 'You can only join up to 3 categories.',
  CATEGORY_JOIN_REQUEST_EXISTS: 'Category join request already exists.',
  FAILED_TO_CREATE_PAYMENT: 'Failed to create payment. Please try again later.',
  PAYMENT_FAILED: 'Payment processing failed. Server is down. Please try again later.',
  SERVICE_NOT_FOUND: 'Service not found.',
  USER_BLOCKED: 'This user has been blocked by the admin.',
  OTP_EXPIRED: 'OTP has expired.',
  PASSWORD_REQUIRED: 'Password is required.',
  USER_LOGIN_WITHOUT_PASSWORD: 'This email is registered via Google. Please log in using Google or use a different email.',
  VENDOR_NOT_FOUND: 'Vendor not found.',
  COMMUNITY_NO_EXIST: 'Community does not exist.',
  NO_SUCH_DATA: 'No matching data found.',
  INVALID_OTP: 'Invalid OTP.',
  INVALID_PASSWORD: 'Invalid password.',
  INVALID_ROLE: 'Invalid role.',
  CONTEST_NOT_FOUND: 'Contest not found.',
  ALREADY_EXISTS: 'Already exists.',
  MISSING_REQUIRED_FIELDS: 'Required fields are missing.',
  NO_CHARGE_FOUND: 'No charge found for this payment.',
  CONFIRM_PAYMENT_FAILED: 'Failed to confirm payment.',
  FAILED_TO_PROCESS_REFUND: 'Failed to process refund.',
  WRONG_ID: 'Invalid ID provided.',
  ID_REQUIRED: 'ID is required.',
  TOKEN_EXPIRED: 'Token has expired.',
  EMAIL_NOT_FOUND: 'Email not found.',
  BOOKING_NOT_FOUND: 'Booking not found.',
  ID_NOT_PROVIDED: 'ID was not provided.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  BLOCKED: 'Access denied. Your account has been blocked.',
  NOT_ALLOWED: 'You are not allowed to perform this action.',
  EMAIL_EXISTS: 'Email already exists.',
  REQUEST_NOT_FOUND: 'Category request not found.',
  CATEGORY_EXISTS: 'Category already exists.',
  CATEGORY_NOT_FOUND: 'Category not found.',
  INVALID_TOKEN: 'Invalid token.',
  INVALID_CREDENTIALS: 'Invalid credentials provided.',
  INVALID_DATAS: 'Insufficient data to update.',
  USER_NOT_FOUND: 'User not found.',
  UNAUTHORIZED_ACCESS: 'Unauthorized access.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'A validation error occurred.',
  MISSING_PARAMETERS: 'Missing required parameters.',
  WRONG_CURRENT_PASSWORD: 'The current password is incorrect.',
  SAME_CURR_NEW_PASSWORD: 'New password must be different from the current password.',
  INVALID_BOOKING_DATE: 'The requested booking date is unavailable.',
  INVALID_TIME_SLOT: 'The requested time slot is invalid.',
  TIME_SLOT_FULL: 'The requested time slot is full.',
  ROUTE_NOT_FOUND: 'Route not found.',
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

export const BOOKING_CONFIRMATION_MAIL_CONTENT = (bookingDetails: {
  eventName: string;
  date: string;
  time: string;
  stripeReceipt : string
}) =>
  EMAIL_WRAPPER(`
    <h1 style="color: #1F2122; font-size: 24px; margin-bottom: 16px;">Your Booking is Confirmed 🎉</h1>
    <p style="font-size: 16px; line-height: 1.6;">
      Thank you for booking with <strong>Bella Imagine</strong>! Here are your event details:
    </p>
    <div style="margin: 24px 0; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <p style="font-size: 16px; margin: 8px 0;"><strong>Event:</strong> ${bookingDetails.eventName}</p>
      <p style="font-size: 16px; margin: 8px 0;"><strong>Date:</strong> ${bookingDetails.date}</p>
      <p style="font-size: 16px; margin: 8px 0;"><strong>Time:</strong> ${bookingDetails.time}</p>
    </div>
    <p style="font-size: 16px; line-height: 1.6;">We can't wait to see you there! Make sure to arrive a little early and bring your confirmation details with you.</p>
    <p style="font-size: 16px; line-height: 1.6;">If you have any questions or need to make changes, please contact our support team anytime.</p>
    <p style="margin-top: 24px; font-size: 16px;">Cheers,<br /><strong>The Bella Imagine Team</strong></p>
`);
