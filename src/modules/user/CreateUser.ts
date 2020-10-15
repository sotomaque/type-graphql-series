import {
  Arg,
  ClassType,
  Field,
  InputType,
  Mutation,
  Resolver,
} from "type-graphql";

import { RegisterInput } from "./register/RegisterInput";
import { User } from "../../entity/User";
import { Product } from "../../entity/Product";

function createBaseResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any) {
      return entity.create(data).save();
    }
  }

  return BaseResolver;
}

@InputType()
class ProductInput {
  @Field()
  name: string;
}

const BaseCreateUser = createBaseResolver("User", User, RegisterInput, User);
const BaseCreateProduct = createBaseResolver(
  "Product",
  Product,
  ProductInput,
  Product
);

@Resolver()
export class CreateUserResolver extends BaseCreateUser {
  //  @Mutation(() => User)
  //     async createUser(@Arg("data") data: RegisterInput) {
  //       return User.create(data).save();
  //     }
}

@Resolver()
export class CreateProductResolver extends BaseCreateProduct {
  //  @Mutation(() => User)
  //     async createUser(@Arg("data") data: RegisterInput) {
  //       return User.create(data).save();
  //     }
}
