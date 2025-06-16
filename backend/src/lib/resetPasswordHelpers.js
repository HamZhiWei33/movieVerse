import crypto from 'crypto';

// Generate 6-digit alphanumeric code
export const generateResetCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Set expiration time (default 5 minutes)
export const getExpirationTime = (minutes = 5) => {
    return new Date(Date.now() + minutes * 60 * 1000);
};

// Check if code is expired
export const isCodeExpired = (expiresAt) => {
    return !expiresAt || new Date() > new Date(expiresAt);
};