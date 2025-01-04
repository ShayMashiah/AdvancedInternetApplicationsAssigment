const request = require("supertest");
const initApp = require("../server");
const mongoose = require("mongoose");
const postModel = require("../models/postModels");

var app;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await postModel.deleteMany();
});

afterAll(async () => {
    console.log("afterAll");
    await mongoose.connection.close();
});

describe("Posts test suite", () => {
    test("Post test get all posts", async () => {
        const response = await request(app).get("/post");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Post test create post", async () => {
        const response = await request(app)
        .post("/post")
        .send({
            title: "title",
            content: "content",
            author: "author"
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("title");
        expect(response.body.content).toBe("content");
        expect(response.body.author).toBe("author");
        postId = response.body._id;
    });

    test("Post test create invalid post", async () => {
        const response = await request(app)
        .post("/post")
        .send({
            title: "title",
            content: "content",
        });
        expect(response.statusCode).not.toBe(200);
    });

    test("Post test get all post after create", async () => {
        const response = await request(app).get("/post");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("Post test get post by author", async () => {
        const response = await request(app).get("/post?author=author");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("Post test get post by id", async () => {
        const response = await request(app).get("/post/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("title");
        expect(response.body.content).toBe("content");
        expect(response.body.author).toBe("author");
    });

    test("Post test get post by id fail", async () => {
        const response = await request(app).get("/posts/67447b032ce3164be7c4412d");
        expect(response.statusCode).toBe(404);
      });


});