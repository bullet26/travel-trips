import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role],
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
  ],
})
export class AppModule {}
