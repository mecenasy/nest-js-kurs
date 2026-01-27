import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthConfig } from 'src/configs/auth.config';
import { TypeConfigService } from 'src/configs/types.config.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from './user.service';
import { AuthService } from './auth/auth.service';
import { PasswordService } from './password/password.service';
import { AuthController } from './auth/auth.controller';
import { TokenService } from './auth/token.service';
import { HashedPassword } from './entity/hashed-password.entity';
import { AuthGuard } from './auth/user.guard';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, HashedPassword]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: TypeConfigService) => ({
        secret: config.get<AuthConfig>('auth')?.jwt.secretKey,
        signOptions: {
          expiresIn: config.get<AuthConfig>('auth')?.jwt.expireAt,
        },
      }),
    }),
  ],
  providers: [
    UserService,
    PasswordService,
    AuthService,
    TokenService,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [UserController, AuthController],
})
export class UserModule {}
