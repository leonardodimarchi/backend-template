import { UserNotFoundError } from '@modules/user/domain/errors/user-not-found.error';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { Either, Left, Right } from '@shared/helpers/either';
import { PasswordResetEntity } from '../../entities/password-reset.entity';
import { PasswordResetRepository } from '../../repositories/password-reset.repository';
import { UseCase } from '@shared/domain/usecases/usecase';
import { MailService } from '@shared/domain/services/mail.service';

export interface RequestPasswordResetUseCaseInput {
  email: string;
}

export interface RequestPasswordResetUseCaseOutput {
  createdPasswordReset: PasswordResetEntity;
}

export type RequestPasswordResetUseCaseErrors = UserNotFoundError | Error;

@Injectable()
export class RequestPasswordResetUseCase
  implements
    UseCase<
      RequestPasswordResetUseCaseInput,
      RequestPasswordResetUseCaseOutput,
      RequestPasswordResetUseCaseErrors
    >
{
  constructor(
    private readonly repository: PasswordResetRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  async exec({
    email,
  }: RequestPasswordResetUseCaseInput): Promise<
    Either<RequestPasswordResetUseCaseErrors, RequestPasswordResetUseCaseOutput>
  > {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      return new Left(new UserNotFoundError());
    }

    const passwordResetResult = PasswordResetEntity.create({
      userId: user.id,
    });

    if (passwordResetResult.isLeft()) {
      return new Left(passwordResetResult.value);
    }

    await this.mailService.send({
      to: [email],
      subject: 'Password Reset',
      bodyHtml: `
        <h1>Here is your password reset code</h1>
        <p>${passwordResetResult.value.code}</p>
      `,
    });

    await this.repository.save(passwordResetResult.value);

    return new Right({ createdPasswordReset: passwordResetResult.value });
  }
}
