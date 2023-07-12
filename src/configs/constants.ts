export const SALT_ROUND = 10;
export const NUMBERS = '0123456789';
export const DEFAULT_OTP_LENGTH = 6;
export const REDIS_EXPIRY_KEY = 'EX';
export const REDIS_EXPIRY_TIME = 60 * 5; // 5 minutes
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})/;