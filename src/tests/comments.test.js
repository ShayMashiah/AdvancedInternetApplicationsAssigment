const request = require("supertest");
const initApp = require("../server");
const mongoose = require("mongoose");
const commentModel = require("../models/commentModels");
const exampleComments = require("../tests/test_comments.json");

var app;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await commentModel.deleteMany();
});

afterAll(async () => {
    console.log("afterAll");
    await mongoose.connection.close();
});

describe("Comments test suite", () => {
    test("Comment test get all comments", async () => {
        const response = await request(app).get("/comment");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

});