import { RequestUserEntity } from '@modules/auth/domain/entities/request-user.entity';
import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UUID } from 'crypto';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET',
    });
  }

  public validate(payload: {
    sub: UUID;
    email: string;
    roles: UserRole[];
  }): RequestUserEntity {
    const entityResult = RequestUserEntity.create({
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    });

    return entityResult.value as RequestUserEntity;
  }
}
