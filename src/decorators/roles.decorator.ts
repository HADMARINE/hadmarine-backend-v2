import { SetMetadata } from '@nestjs/common';
import { AuthorityEnum } from 'src/users/authority.enum';

export const Roles = (...args: AuthorityEnum[]) => SetMetadata('roles', args);
