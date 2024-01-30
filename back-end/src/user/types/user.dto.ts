import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../roles/user.role';

@ObjectType()
export class UserDto {
  @Field()
  id!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;

  @Field(() => UserRole, { defaultValue: 'USER' })
  role!: UserRole;

  @Field(() => [String], { nullable: true })
  favoriteActivities?: string[] = [];
}
