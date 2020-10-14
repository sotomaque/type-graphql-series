
import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs'

import { User } from '../../entity/User';
import { redis } from '../../redis';
import { ChangePasswordInput } from './changePassword/ChangePasswordInput';
import { forgetPasswordPrefix } from '../../constants/redisPrefixes';
import { MyContext } from '../../types/MyContext';

// always returns true to avoid indicating to end user
// whether or not email exists in our DB
@Resolver()
export class ChangePasswordResolver {

    @Mutation(() => User, { nullable: true })
    async changePassword(
        @Arg('data') { token, password }: ChangePasswordInput,
        @Ctx() ctx: MyContext
    ): Promise<User | null>{
        const userId = await redis.get(forgetPasswordPrefix + token);
        // if token has expired or we have an invalid token, return null
        if (!userId) {
            return null;
        }
        // fetch user
        const user = await User.findOne(userId);
        if (!user) {
            return null;
        }
        // clear token from redis
        await redis.del(forgetPasswordPrefix + token);
        // update password
        user.password = await bcrypt.hash(password, 12);
        await user.save();
        // auto login user after password changes
        ctx.req.session!.userId = user.id; // by setting cookie = userId
        
        return user;
    }

}