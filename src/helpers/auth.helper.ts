import {HttpErrors} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {EnumToken} from '../enums';

export function authorized(token: string): void {
  if (!token) {
    throw new HttpErrors.Unauthorized('!توکنی وجود ندارد')
  }
  token = token.split(" ")[1];
  jwt.verify(token, EnumToken.SecretAccessToken, function (err: any) {
    if (err) {
      throw new HttpErrors.Unauthorized(err.message)
      // throw new HttpErrors.Unauthorized('همچین توکنی وجود ندارد یا منقضی شده است')
    }
  });
}
