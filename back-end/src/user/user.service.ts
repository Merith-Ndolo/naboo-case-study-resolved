import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpInput } from 'src/auth/types';
import { User } from './schema/user.schema';
import { Activity } from 'src/activity/schema/activity.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // ! TODO: fix type
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(data: SignUpInput, role = 'USER'): Promise<User> {
    const user = new this.userModel({ ...data, role });
    return user.save();
  }

  async updateToken(id: string, token: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.token = token;
    return user.save();
  }

  async addNewFavorite(userId: string, activity: Activity) {
    await this.userModel.findByIdAndUpdate(userId, {
      $push: {
        favoriteActivities: activity._id,
      },
    });
  }

  async removeFavorite(userId: string, user: User, activity: Activity) {
    await this.userModel.findByIdAndUpdate(userId, {
      $set: {
        favoriteActivities: user?.favoriteActivities?.filter(
          (favActivityId) => {
            favActivityId.toString() !== activity._id.toString();
          },
        ),
      },
    });
  }

  async countDocuments(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
