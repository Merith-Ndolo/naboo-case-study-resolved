import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from './schema/activity.schema';
import { CreateActivityInput } from './types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private activityModel: Model<Activity>,
    private userService: UserService,
  ) {}

  async findAll(): Promise<Activity[]> {
    return this.activityModel
      .find()
      .sort({ createdAt: -1 })
      .populate('owner')
      .exec();
  }

  async findLatest(): Promise<Activity[]> {
    return this.activityModel
      .find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('owner')
      .exec();
  }

  async findByUser(userId: string): Promise<Activity[]> {
    return this.activityModel
      .find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate('owner')
      .exec();
  }

  async findUserFavoritesActivities(userId: string): Promise<Activity[]> {
    return this.activityModel
      .find({ addedByUsersAsFavorites: { $in: [userId] } })
      .sort({ createdAt: -1 })
      .populate('owner')
      .exec();
  }

  async findOne(id: string): Promise<Activity> {
    const activity = await this.activityModel
      .findById(id)
      .populate('owner')
      .exec();
    if (!activity) throw new NotFoundException();
    return activity;
  }

  async create(userId: string, data: CreateActivityInput): Promise<Activity> {
    const activity = await this.activityModel.create({
      ...data,
      owner: userId,
    });
    return activity.populate('owner');
  }

  async findCities(): Promise<string[]> {
    return this.activityModel.distinct('city').exec();
  }

  async findByCity(
    city: string,
    activity?: string,
    price?: number,
  ): Promise<Activity[]> {
    return this.activityModel
      .find({
        $and: [
          { city },
          ...(price ? [{ price }] : []),
          ...(activity ? [{ name: { $regex: activity, $options: 'i' } }] : []),
        ],
      })
      .populate('owner')
      .exec();
  }

  async toggleFavoriteActivity(
    userId: string,
    activityId: string,
  ): Promise<Activity> {
    try {
      const user = await this.userService.getById(userId);
      const activity = await this.findOne(activityId);

      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      const isActivityAlreadyAdded = user?.favoriteActivities?.some(
        (favActivityId) => favActivityId.toString() === activity._id.toString(),
      );

      let res: Activity;

      if (!isActivityAlreadyAdded) {
        await this.userService.addNewFavorite(userId, activity);
        res = await this.addUserToActivitiesFavorites(userId, activity);
      } else {
        await this.userService.removeFavorite(userId, user, activity);
        res = await this.removeUserFromActivitiesFavorites(userId, activity);
      }

      return res;
    } catch (error: any) {
      throw new Error(`An error ocurred: ${error.message}`);
    }
  }

  async addUserToActivitiesFavorites(
    userId: string,
    activity: Activity,
  ): Promise<Activity> {
    const userAlreadyAdded = activity.addedByUsersAsFavorites.includes(userId);

    if (!userAlreadyAdded) {
      await this.activityModel.findByIdAndUpdate(activity.id, {
        $push: { addedByUsersAsFavorites: userId },
      });
    }
    // update the local copy
    activity.addedByUsersAsFavorites.push(userId);
    return activity;
  }

  async removeUserFromActivitiesFavorites(
    userId: string,
    activity: Activity,
  ): Promise<Activity> {
    const userAlreadyAdded = activity.addedByUsersAsFavorites.includes(userId);
    if (userAlreadyAdded) {
      await this.activityModel.findByIdAndUpdate(activity._id, {
        $pull: { addedByUsersAsFavorites: userId },
      });
    }
    // update the local copy
    activity.addedByUsersAsFavorites = activity.addedByUsersAsFavorites.filter(
      (id) => id.toString() !== userId.toString(),
    );
    return activity;
  }

  async countDocuments(): Promise<number> {
    return this.activityModel.estimatedDocumentCount().exec();
  }
}
