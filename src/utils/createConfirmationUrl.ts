import { v4 } from 'uuid';

import { redis } from '../redis';
import { confirmationPrefix } from '../constants/redisPrefixes';

export const createConfirmationUrl = async (userId: number) => {
    // create a token associated with userId
    // when link is clicked we want to send that token to server
    const token = v4();
    await redis.set(confirmationPrefix + token, userId, "ex", 60 * 60 * 24); // 1d expiration

    return `http://localhost:3000/user/confirm/${token}`;
}