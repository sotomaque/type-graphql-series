import { MyContext } from "src/types/MyContext";
import { MiddlewareFn } from "type-graphql";

const isAuth: MiddlewareFn<MyContext> = async({ context }, next) => {
   if (!context.req.session!.userId) {
       throw new Error("Not Authenticated!")
   }

    return next();
}

export default isAuth;
