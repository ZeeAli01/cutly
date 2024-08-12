import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from 'common/middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UrlsModule } from './urls/urls.module';
import { UrlRedirectMiddleware } from 'common/middleware/url-redirect.middleware';


@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, UrlsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // logger middlware:
    consumer
      .apply(LoggerMiddleware) //middle ware before get request.
      .exclude({ path: 'urls/redirect/:url', method: RequestMethod.GET },)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    //url redirecting middleware /:url([a-zA-Z0-9]{14})
    consumer.
      apply(UrlRedirectMiddleware)
      .forRoutes({ path: 'urls/redirect/:url', method: RequestMethod.GET });
  }
}
