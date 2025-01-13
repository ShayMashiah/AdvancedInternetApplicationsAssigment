import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/commentModels";
import userModel from "../models/userModel";
import postModel from "../models/postModels";
import { Express } from "express";


let app: Express;
let token: string;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");

  await commentModel.deleteMany();
  await userModel.deleteMany();

  const userResponse = await request(app).post("/auth/register").send({
      email: "testuser",
      password: "testpassword",
  });
  expect(userResponse.statusCode).toBe(201);

  const loginResponse = await request(app).post("/auth/login").send({
      email: "testuser",
      password: "testpassword",
  });
  expect(loginResponse.statusCode).toBe(200);

  token = loginResponse.body.accessToken; 
});

afterAll(async () => {
  console.log("afterAll");
  await commentModel.deleteMany();
  await postModel.deleteMany();
  await mongoose.connection.close();
});

describe("Comments test suite", () => {
  let postId;
  let commentId;
  
  test("Comment test get all comments", async () => {
    const response = await request(app).get("/comment");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Comment test Create Comment", async () => {
    // Create a new post
    const newPost = await request(app).post("/post")
      .set({ authorization: "JWT " + token })
      .send({
        title: "Test Post",
        content: "This is a test post",
        author: "Shay Mashiah",
      });
    // Save the post
    expect(newPost.statusCode).toBe(201); 
    postId = newPost.body._id; 
    // Create a new comment
    const exampleComment = {
      PostId: postId,
      content: "This is a comment",
      author: "Shay Mashiah",
    };
    const exampleComment2 = {
      PostId: postId,
      content: "This is a comment 2",
      author: "Omri Ivry",
    };
    // Save the first comments
    const response = await request(app).post("/comment")
      .set({ authorization: "JWT " + token })
      .send(exampleComment);
    // Create the second comment
    await request(app).post("/comment")
      .set({ authorization: "JWT " + token })
      .send(exampleComment2);

    expect(response.statusCode).toBe(201);
    expect(response.body.PostId).toBe(postId.toString());
    expect(response.body.content).toBe(exampleComment.content);
    expect(response.body.author).toBe(exampleComment.author);
    commentId = response.body._id;
  });
  
//new test -> create comment to non existing post
  test("Comment test create comment to non existing post", async () => {
    const exampleComment = {
      PostId: "507f191e810c19729de860ea",
      content: "This is a comment",
      author: "Shay Mashiah",
    };
    const response = await request(app).post("/comment")
      .set({ authorization: "JWT " + token })
      .send(exampleComment);
    expect(response.statusCode).toBe(404);
  });

  test("Comment test get all comments after create", async () => {
    const response = await request(app).get("/comment");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("Comment test get comment by author", async () => {
    const response = await request(app).get("/comment?author=Shay Mashiah");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].author).toBe("Shay Mashiah");
  });

  test("Comment test create invalid comment", async () => {
    const response = await request(app)
    .post("/comment")
      .set({ authorization: "JWT " + token })
      .send({
        content: "This is a comment",
        author: "Shay Mashiah"});
    expect(response.statusCode).not.toBe(200);
    });

  test("Comment test get comment by post id", async () => {
    const response = await request(app).get("/comment/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body[0].PostId).toBe(postId.toString());
    expect(response.body[0].content).toBe("This is a comment");
    expect(response.body[0].author).toBe("Shay Mashiah");
    expect(response.body[1].PostId).toBe(postId.toString());
    expect(response.body[1].content).toBe("This is a comment 2");
    expect(response.body[1].author).toBe("Omri Ivry");
  });

  test("Comment test get comment by post id fail", async () => {
    const response = await request(app).get("/comment/507f191e810c19729de860ea");
    expect(response.statusCode).toBe(404);
  });

  test("Comment test update comment", async () => {
    const updatedComment = {
      PostId: postId,
      content: "This is an updated comment",
      author: "Shay Mashiah"
    };
    const responseComment = await request(app)
      .put("/comment/" + commentId)
      .set({ authorization: "JWT " + token })
      .send(updatedComment);
    expect(responseComment.statusCode).toBe(200);
    expect(responseComment.body.content).toBe("This is an updated comment");
  });

  test("Comment test delete comment", async () => {
    const response = await request(app)
      .delete("/comment/" + commentId)
      .set({ authorization: "JWT " + token });
    expect(response.statusCode).toBe(200);
  });

});
