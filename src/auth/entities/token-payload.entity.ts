import mongoose from 'mongoose';
import { AuthorityEnum } from 'src/users/authority.enum';
import { TokenTypeEnum } from '../enum/token-type.enum';

export class TokenPayloadEntity {
  user: mongoose.Types.ObjectId;
  type: TokenTypeEnum;
  authority: AuthorityEnum[];
}
