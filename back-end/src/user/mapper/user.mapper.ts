import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/utils/mapper';
import { User } from '../schema/user.schema';
import { UserDto } from '../types/user.dto';

@Injectable()
export class UserMapper implements Mapper<User, UserDto> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  convert(user: User): UserDto {
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      favoriteActivities: user.favoriteActivities,
      role: user.role,
    };
  }
}
