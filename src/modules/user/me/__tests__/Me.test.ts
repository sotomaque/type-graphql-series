import { Connection } from "typeorm";
import faker from "faker";

import { gCall } from "../../../../test-utils/gCall";
import { testConn } from "../../../../test-utils/testConn";
import { User } from "../../../../entity/User";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.close();
});

const meQuery = `
{
	me {
    id
    firstName
    lastName
    email
    name
	}
}`;

describe("Me Resolver", () => {
  // logged in
  test("get user", async () => {
    const user = await User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }).save();

    // login with user to access
    // aka pass it into our context
    const res = await gCall({
      source: meQuery,
      userId: user.id,
    });

    console.log(res);

    // expect(res).toBeTruthy();
    expect(res).toMatchObject({
      data: {
        me: {
          id: `${user.id}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });
  });

  // logged out
  test("returns null", async () => {
    const res = await gCall({
      source: meQuery,
    });

    // expect(res).toBeTruthy();
    expect(res).toMatchObject({
      data: {
        me: null,
      },
    });
  });
});
