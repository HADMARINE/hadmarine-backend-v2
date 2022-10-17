import { AuthorityEnum } from 'src/users/authority.enum';
import { TokenTypeEnum } from '../enum/token-type.enum';

export class TokenPayloadEntity {
  userid: string;
  type: TokenTypeEnum;
  authority: AuthorityEnum[];
}
