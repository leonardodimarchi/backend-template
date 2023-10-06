import { RequestUserEntity } from '@modules/auth/domain/entities/request-user.entity';
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

  public validate(payload: { sub: UUID; email: string }): RequestUserEntity {
    const entityResult = RequestUserEntity.create({
      id: payload.sub,
      email: payload.email,
    });

    return entityResult.value as RequestUserEntity;
  }
}
