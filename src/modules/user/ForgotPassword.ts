
import { Resolver, Mutation, Arg } from 'type-graphql';
import { v4 } from 'uuid';

import { User } from '../../entity/User';
import { redis } from '../../redis';
import { sendEmail } from '../../utils';
import { forgetPasswordPrefix } from '../../constants/redisPrefixes';

// always returns true to avoid indicating to end user
// whether or not email exists in our DB
@Resolver()
export class ForgotPasswordResolver {

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string
    ): Promise<boolean>{
        // ensure user exists
        const user = await User.findOne({ where: { email }});
        if (!user) {
            return true;
        }
        // generate random token
        const token = v4();
        // set random token in redis for 1 day
        await redis.set(forgetPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // 1day expiration
        // send email to users email with token
        await sendEmail(email, `http://localhost:3000/user/change-password/${token}`);
        return true;
    }

}