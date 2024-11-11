import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ProfileModule
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AccessTokenGuard,
    // },
  ],
})
export class CoreModule { }
