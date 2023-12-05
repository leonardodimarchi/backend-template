import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Password Resets')
@Controller('password-resets')
export class PasswordResetController {
  constructor() {}
}
