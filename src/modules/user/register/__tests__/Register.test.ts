import { Connection } from "typeorm";

import { gCall } from "../../../../test-utils/gCall";
import { testConn } from "../../../../test-utils/testConn";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Register Resolver", () => {
  test("should successfully create user using the register mutation when valid credentials are passed", async () => {
    
    const res = await gCall({
			source: registerMutation,
			variableValues: {
				data: {
					firstName: "bob",
					lastName: "bob2",
					email: "bob@bob.com",
					password: "asdfasdf"
				}
			}
		});
		expect(res).toBeTruthy();

		const expectedResponse = {
      data: {
        register: {
          id: '1',
          firstName: 'bob',
          lastName: 'bob2',
          email: 'bob@bob.com',
          name: 'bob bob2'
        }
      }
		}
		
		expect(res).toEqual(expectedResponse)
  
  });
});
