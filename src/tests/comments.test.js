const request = require("supertest");
const initApp = require("../server");
const mongoose = require("mongoose");
const commentModel = require("../models/commentModels");
const postModel = require("../models/postModels");

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
  let postId; 
  
  // Test get all comments
  test("Comment test get all comments", async () => {
    const response = await request(app).get("/comment");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Comment test Create Comment", async () => {
    // Create a new post
    const newPost = await request(app).post("/post").send({
      title: "Test Post",
      content: "This is a test post",
      author: "Shay Mashiah",
    });
    // Save the post
    console.log(newPost.body);
    expect(newPost.statusCode).toBe(201); 
    postId = newPost.body._id; 
    // Create a new comment
    const exampleComment = {
      PostId: postId,
      content: "This is a comment",
      author: "Shay Mashiah",
    };
    // Save the comment
    const response = await request(app).post("/comment").send(exampleComment);
    expect(response.statusCode).toBe(200);
    expect(response.body.PostId).toBe(postId.toString());
    expect(response.body.content).toBe(exampleComment.content);
    expect(response.body.author).toBe(exampleComment.author);
    commentId = response.body._id;
    console.log(commentId);
  });

  test("Comment test get all comments after create", async () => {
    const response = await request(app).get("/comment");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Comment test get comment by author", async () => {
    const response = await request(app).get("/comment?author=Shay Mashiah");
    console.log(response.body); 
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].author).toBe("Shay Mashiah");
  });

  test("Comment test create invalid comment", async () => {
    const response = await request(app)
    .post("/comment")
    .send({
      content: "This is a comment",
      author: "Shay Mashiah"});
    expect(response.statusCode).not.toBe(200);
    });

  test("Comment test get comment by post id", async () => {
    const response = await request(app).get("/comment/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].PostId).toBe(postId.toString());
    expect(response.body[0].content).toBe("This is a comment");
    expect(response.body[0].author).toBe("Shay Mashiah");
  });

  test("Comment test get comment by post id fail", async () => {
    const response = await request(app).get("/comment/123");
    expect(response.statusCode).toBe(404);
  });

  test("Comment test update comment", async () => {
    const updatedComment = {
      PostId: postId,
      content: "This is an updated comment",
      author: "Shay Mashiah"
    };
    const responseComment = await request(app).put("/comment/" + commentId).send(updatedComment);
    console.log(commentId);
    console.log(responseComment.body);
    expect(responseComment.statusCode).toBe(200);
    expect(responseComment.body.content).toBe("This is an updated comment");
  });

  test("Comment test delete comment", async () => {
    const response = await request(app).delete("/comment/" + commentId);
    expect(response.statusCode).toBe(200);
  });

});
