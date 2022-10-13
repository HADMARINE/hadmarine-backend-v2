import mongoose from 'mongoose';

export class TokenPayloadEntity {
  constructor(userid: string, type: TOKEN_TYPE, authority: string) {
    this.userid = userid;
    this.type = type;
    this.authority = authority;
  }

  userid: string;
  type: TOKEN_TYPE;
  authority: string;

  objectify() {
    return {
      userid: this.userid,
      type: this.type,
      authority: this.authority,
    };
  }
}

export enum TOKEN_TYPE {
  ACCESS,
  REFRESH,
  OTHER,
}
