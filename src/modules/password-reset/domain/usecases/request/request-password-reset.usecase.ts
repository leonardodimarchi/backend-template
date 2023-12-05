import { RequestUserEntity } from '@modules/auth/domain/entities/request-user.entity';
import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/domain/usecase';
import { Either, Left, Right } from '@shared/helpers/either';
import { PasswordResetEntity } from '../../entities/password-reset.entity';
import { PasswordResetRepository } from '../../repositories/password-reset.repository';

export interface RequestPasswordResetUseCaseInput {
  requestUser: RequestUserEntity;
}

export interface RequestPasswordResetUseCaseOutput {
  createdPasswordReset: PasswordResetEntity;
}

export type RequestPasswordResetUseCaseErrors = Error;

@Injectable()
export class RequestPasswordResetUseCase
  implements
    UseCase<
      RequestPasswordResetUseCaseInput,
      RequestPasswordResetUseCaseOutput,
      RequestPasswordResetUseCaseErrors
    >
{
  constructor(private readonly repository: PasswordResetRepository) {}

  async exec({
    requestUser,
  }: RequestPasswordResetUseCaseInput): Promise<
    Either<RequestPasswordResetUseCaseErrors, RequestPasswordResetUseCaseOutput>
  > {
    const PasswordResetResult = PasswordResetEntity.create({
      userId: requestUser.id,
    });

    if (PasswordResetResult.isLeft()) {
      return new Left(PasswordResetResult.value);
    }

    await this.repository.save(PasswordResetResult.value);

    return new Right({ createdPasswordReset: PasswordResetResult.value });
  }
}
