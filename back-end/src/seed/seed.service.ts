import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ActivityService } from '../activity/activity.service';
import { UserService } from '../user/user.service';
import { activities as activitiesData } from './activity.data';
import { user as userData } from './user.data';
import { SignUpInput } from 'src/auth/types';

@Injectable()
export class SeedService {
  constructor(
    private userService: UserService,
    private activityService: ActivityService,
  ) {}

  async seedDefaultUser() {
    const admin: SignUpInput = {
      firstName: 'Admin',
      lastName: 'Admin',
      email: process.env.ADMIN_EMAIL || '',
      password: process.env.ADMIN_PASSWORD || '',
    };

    const existingAdminUser = await this.userService.findByEmail(admin.email);
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    if (!existingAdminUser) {
      await this.userService.createUser(
        { ...admin, password: hashedPassword },
        'ADMIN',
      );
    }
  }

  async execute(): Promise<void> {
    const users = await this.userService.countDocuments();
    const activities = await this.activityService.countDocuments();

    if (users === 0 && activities === 0) {
      try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.userService.createUser({
          ...userData,
          password: hashedPassword,
        });

        await Promise.all(
          activitiesData.map((activity) =>
            this.activityService.create(user._id, activity),
          ),
        );
        Logger.log('Seeding successful!');
      } catch (error) {
        Logger.error(error);
        throw error;
      }
    }
  }
}
