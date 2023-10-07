export type Tokens = {
  userId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAccsessToken: number;
  expiresRefreshToken: number;
};
