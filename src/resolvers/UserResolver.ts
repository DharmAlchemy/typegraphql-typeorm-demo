import { Mutation, Resolver, Arg, Int, Query, InputType, Field } from "type-graphql";
import { User } from "../entity/User";
import * as redis from "redis";
const client = redis.createClient(6379);

@InputType()
class userCreateType {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => Int)
  age: number;
}

@InputType()
class userUpdateType {
  @Field(() => String, { nullable: true })
  firstName: string | null;

  @Field(() => String, { nullable: true })
  lastName: string | null;

  @Field(() => Int, { nullable: true })
  age: number | null;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async createUser(@Arg("options", () => userCreateType) options: userCreateType) {
    const user = await User.create(options).save();
    return user;
  }

  @Query(() => [User], { nullable: true })
  async readUser() {
    const users = await User.find({
      cache: true,
    });
    return users;
  }

  @Mutation(() => Boolean)
  async updateUser(
    @Arg("id", () => Int) id: number,
    @Arg("options", () => userUpdateType) options: userUpdateType
  ) {
    const user = await User.update({ id }, options);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => Int) id: number) {
    const user = await User.findOneOrFail({ id });
    await User.softRemove(user);
    return true;
  }
}
