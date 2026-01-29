// backend/src/auth/constants.ts

export const jwtConstants = {
  secret: process.env.JWT_SECRET || '1234567890abcdef', // En producción iría el de .env
};
