import { buildSchema } from "type-graphql";

export const createSchema = async () => buildSchema({
    resolvers: [__dirname + '/../modules/*/*.ts'],
    authChecker: ({ context: { req } }) => {
            return !!req.session.userId
    }
});
