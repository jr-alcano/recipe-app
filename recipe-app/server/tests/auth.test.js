// tests/auth.test.js

const request = require("supertest");
const app = require("../app");
const db = require("../db");

beforeEach(async () => {
  await db.query("DELETE FROM users");
});

afterAll(async () => {
  await db.end();
});

describe("POST /auth/register", () => {
  it("registers a new user and returns a token and user id", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "testpass123"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("id");
    expect(typeof res.body.token).toBe("string");
    expect(typeof res.body.id).toBe("number");
  });
});

describe("POST /auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/auth/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "testpass123"
    });
  });

  it("logs in a valid user and returns token and id", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "testpass123"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("id");
    expect(typeof res.body.token).toBe("string");
    expect(typeof res.body.id).toBe("number");
  });

  it("rejects login with wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "wrongpass"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Invalid credentials" });
  });

  it("rejects login with non-existent user", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "nouser",
      password: "whatever"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Invalid credentials" });
  });
});
