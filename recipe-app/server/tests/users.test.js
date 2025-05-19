const request = require("supertest");
const app = require("../app");

const db = require("../db");

afterAll(async () => {
  await db.end(); 
});

describe("GET /users", () => {
  it("returns list of users", async () => {
    const resp = await request(app).get("/users");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toBeInstanceOf(Array);
    expect(resp.body.length).toBeGreaterThan(0);
  });
});
