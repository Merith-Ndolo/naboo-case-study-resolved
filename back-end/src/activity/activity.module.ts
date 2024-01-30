import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityService } from './activity.service';
import { ActivityMapper } from './mapper/activity.mapper';
import { Activity, ActivitySchema } from './schema/activity.schema';
import { ActivityResolver } from './resolver/activity.resolver';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { UserMapper } from 'src/user/mapper/user.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  exports: [ActivityService, ActivityMapper, UserService],
  providers: [
    ActivityService,
    ActivityMapper,
    ActivityResolver,
    UserService,
    UserMapper,
  ],
})
export class ActivityModule {}
