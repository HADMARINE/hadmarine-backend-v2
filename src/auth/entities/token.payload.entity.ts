import mongoose from 'mongoose';

export class TokenPayloadEntity {
  userid: string;
  type: TOKEN_TYPE;
  authority: string;
}

export enum TOKEN_TYPE {
  ACCESS,
  REFRESH,
  OTHER,
}
