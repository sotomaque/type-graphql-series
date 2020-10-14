import { MiddlewareFn } from "type-graphql";

const logger: MiddlewareFn = async({ args }, next) => {
    console.log('args: ', args)
    return next();
}

export default logger;
