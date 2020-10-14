import { redis } from '../redis';
import { v4 } from 'uuid';


export const createConfirmationUrl = async (userId: number) => {
    // create a token associated with userId
    // when link is clicked we want to send that token to server
    const id = v4();
    await redis.set(id, userId, "ex", 60 * 60 * 24); // 1d expiration

    return `http://localhost:3000/user/confirm/${id}`;
}