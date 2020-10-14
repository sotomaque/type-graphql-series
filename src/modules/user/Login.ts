import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class LoginResolver {

    @Mutation(() => User, { nullable: true })
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() ctx: MyContext
    ): Promise<User | null>{
        // find user in db
        const user = await User.findOne({ where: { email } });
        // if not found, return null
        if (!user) return null;

        // compare encrypted passwords
        const valid = await bcrypt.compare(password, user.password);
        // if they dont match, return null
        if (!valid) return null;

        // TODO: throw error rather than returning null 
        if (!user.confirmed) return null

        // otherwise, return user
        ctx.req.session!.userId = user.id; // send back cookie
        return user;
    }

}