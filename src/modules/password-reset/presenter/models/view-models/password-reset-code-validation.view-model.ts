import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetCodeValidationViewModel {
  @ApiProperty()
  isValid: boolean;
}
