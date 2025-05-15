import ms from 'ms';

export type AuthConfig = {
  accessTokenSecret?: string;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresIn?: number;
  resetTokenExpires?: ms.StringValue;
};
