// tests/recipes.test.js

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let token;
let userId;
let savedRecipeId;

beforeAll(async () => {
  await db.query("DELETE FROM users");

  const res = await request(app).post("/auth/register").send({
    username: "testuser",
    email: "test@example.com",
    password: "password123"
  });

  token = res.body.token;
  userId = res.body.id;
});

beforeEach(async () => {
  await db.query("DELETE FROM notes");
  await db.query("DELETE FROM saved_recipes");

  const res = await request(app)
    .post("/recipes/save")
    .set("Authorization", `Bearer ${token}`)
    .send({
      recipe_id: 9999,
      title: "Test Recipe",
      image: "http://image.jpg"
    });

  savedRecipeId = res.body.id;
});

afterAll(async () => {
  await db.query("DELETE FROM notes");
  await db.query("DELETE FROM saved_recipes");
  await db.query("DELETE FROM users");
  await db.end();
});

describe("GET /recipes/search", () => {
  it("returns list of recipes from API", async () => {
    const resp = await request(app).get("/recipes/search?query=chicken");
    expect(resp.statusCode).toBe(200);
    expect(Array.isArray(resp.body)).toBe(true);
    expect(resp.body[0]).toHaveProperty("title");
    expect(resp.body[0]).toHaveProperty("image");
  });
});

describe("POST /recipes/save", () => {
  it("saves a recipe for a user", async () => {
    const resp = await request(app)
      .post("/recipes/save")
      .set("Authorization", `Bearer ${token}`)
      .send({
        recipe_id: 123456,
        title: "Some Recipe Name",
        image: "http://some.url/image.jpg"
      });

    expect(resp.statusCode).toBe(201);
    expect(resp.body).toHaveProperty("id");
    expect(resp.body.title).toBe("Some Recipe Name");
  });
});

describe("GET /recipes/user/:id", () => {
  it("returns saved recipes for a user", async () => {
    const resp = await request(app)
      .get(`/recipes/user/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(resp.statusCode).toBe(200);
    expect(Array.isArray(resp.body)).toBe(true);
    expect(resp.body[0]).toHaveProperty("recipe_id");
    expect(resp.body[0].title).toBe("Test Recipe");
  });
});

describe("DELETE /recipes/:id", () => {
  it("deletes a saved recipe", async () => {
    const resp = await request(app)
      .delete(`/recipes/${savedRecipeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted successfully" });
  });
});

describe("POST /recipes/:id/note", () => {
  it("adds a note to a saved recipe", async () => {
    const resp = await request(app)
      .post(`/recipes/${savedRecipeId}/note`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "This is a test note for the recipe" });

    expect(resp.statusCode).toBe(201);
    expect(resp.body).toHaveProperty("id");
    expect(resp.body.content).toBe("This is a test note for the recipe");
  });
});

describe("GET /recipes/:id/notes", () => {
  it("retrieves notes for a saved recipe", async () => {
    await db.query(
      `INSERT INTO notes (saved_recipe_id, content)
       VALUES ($1, 'This is another test note')`,
      [savedRecipeId]
    );

    const resp = await request(app)
      .get(`/recipes/${savedRecipeId}/notes`)
      .set("Authorization", `Bearer ${token}`);

    expect(resp.statusCode).toBe(200);
    expect(Array.isArray(resp.body)).toBe(true);
    expect(resp.body[0]).toHaveProperty("content");
  });
});

describe("GET /recipes/:id/details", () => {
    it("fetches detailed information for a recipe", async () => {
      const resp = await request(app)
        .get("/recipes/715538/details"); // Example recipe ID from Spoonacular
  
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toHaveProperty("id");
      expect(resp.body).toHaveProperty("title");
      expect(resp.body).toHaveProperty("image");
      expect(resp.body).toHaveProperty("readyInMinutes");
      expect(resp.body).toHaveProperty("servings");
      expect(resp.body).toHaveProperty("instructions");
      expect(Array.isArray(resp.body.ingredients)).toBe(true);
    });
  });
  
