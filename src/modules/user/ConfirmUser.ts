
import { Resolver, Mutation, Arg } from 'type-graphql';

import { User } from '../../entity/User';
import { redis } from '../../redis';
import { confirmationPrefix } from '../../constants/redisPrefixes';

@Resolver()
export class ConfirmUserResolver {

    @Mutation(() => Boolean)
    async confirmUser(
        @Arg('token') token: string
    ): Promise<boolean>{
        // check if token exists
        const userId = await redis.get(confirmationPrefix + token);
        if (!userId) return false;

        await User.update({ id: parseInt(userId, 10) }, { confirmed: true })
        await redis.del(token);

        return true;
    }

}