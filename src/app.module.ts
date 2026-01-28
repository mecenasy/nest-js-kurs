import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './configs/app.config';
import { configSchema } from './configs/config.types';
import { typeOrmConfig } from './configs/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeConfigService } from './configs/types.config.service';
import { authConfig } from './configs/auth.config';
import { UserModule } from './user/user.module';
// import { UniversityModule } from './university/university.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypeConfigService) => ({
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        ...configService.get('db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeOrmConfig, authConfig],
      validationSchema: configSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    TasksModule,
    UserModule,
    MenuModule,
    // UniversityModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: TypeConfigService,
      useExisting: ConfigService,
    },
  ],
})
export class AppModule {}
