import { SetMetadata } from '@nestjs/common';

export const JwtForceVerify = (v = true) => SetMetadata('jwtForceVerify', v);
