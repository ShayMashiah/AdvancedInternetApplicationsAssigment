import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/postModels";
import userModel from "../models/userModel";
import { Express } from "express";
import commentModel from "../models/commentModels";


let app: Express;
let postId: string;
let token: string;

beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll");
    await postModel.deleteMany();
    await userModel.deleteMany();
    await commentModel.deleteMany();
  
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
    await mongoose.connection.close();
});

describe("Posts test suite", () => {
    test("Post test - Get all posts", async () => {
        const response = await request(app).get("/post");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Post test - Error get all posts", async () => {
      jest.spyOn(postModel, 'find').mockImplementation(() => {
        throw new Error("Database error");
    });
        const response = await request(app).get("/posts");
        expect(response.statusCode).not.toBe(400);

        (postModel.find as jest.Mock).mockRestore();
    });

    test("Post test - Create post", async () => {
        const response = await request(app)
          .post("/post")
          .set({ authorization: "JWT " + token })
          .send({
            title: "title",
            content: "content",
            author: "author",
          });
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("title");
        expect(response.body.content).toBe("content");
        expect(response.body.author).toBe("author");
        postId = response.body._id;
    });

    test("Post test - Error create post", async () => {
      jest.spyOn(postModel, 'create').mockImplementation(() => {
        throw new Error("Database error");
    });
        const response = await request(app)
          .post("/post")
          .set({ authorization: "JWT " + token })
          .send({
            title: "title",
            content: "content",
            author: "author",
          });
        expect(response.statusCode).toBe(400);
        (postModel.create as jest.Mock).mockRestore();
    });

    test("Post test - Create post without token", async () => {
        const response = await request(app)
          .post("/post")
          .set({ authorization: "JWT" + ""})
          .send({
            title: "title",
            content: "content",
            author: "author",
          });
        expect(response.statusCode).toBe(401);
      });

    test("Post test - Create invalid post", async () => {
        const response = await request(app)
          .post("/post")
          .set({ authorization: "JWT " + token })
          .send({
            title: "title",
            content: "content",
          });
        expect(response.statusCode).not.toBe(200);
      });

    test("Post test - Get all post after create", async () => {
        const response = await request(app).get("/post");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("Post test - Get post by author", async () => {
        const response = await request(app).get("/post?author=author");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("Post test - Get post by author error", async () => {
      jest.spyOn(postModel, 'find').mockImplementation(() => {
        throw new Error("Database error");
    });
        const response = await request(app).get("/post?author=author");
        expect(response.statusCode).not.toBe(200);
        (postModel.find as jest.Mock).mockRestore();
    });

    test("Post test - Get post by id", async () => {
        const response = await request(app).get("/post/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("title");
        expect(response.body.content).toBe("content");
        expect(response.body.author).toBe("author");
    });

    test("Post test - Get post by id error", async () => {
      jest.spyOn(postModel, 'findById').mockImplementation(() => {
        throw new Error("Database error");
    });
        const response = await request(app).get("/post/" + postId);
        expect(response.statusCode).not.toBe(200);
        (postModel.findById as jest.Mock).mockRestore();
    });

    test("Post test - Get post by id fail", async () => {
        const response = await request(app).get("/posts/67447b032ce3164be7c4412d");
        expect(response.statusCode).toBe(404);
      });
    
      test("Post test - Update post", async () => {
        const response = await request(app)
          .put("/post/" + postId)
          .set({ authorization: "JWT " + token }) 
          .send({
            title: "new title",
            content: "new content",
            author: "new author",
          });
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("new title");
        expect(response.body.content).toBe("new content");
        expect(response.body.author).toBe("new author");
      });

      test("Post test - Update post error", async () => {
        jest.spyOn(postModel, 'findByIdAndUpdate').mockImplementation(() => {
          throw new Error("Database error");
      });
          const response = await request(app)
            .put("/post/" + postId)
            .set({ authorization: "JWT " + token }) 
            .send({
              title: "new title",
              content: "new content",
              author: "new author",
            });
          expect(response.statusCode).toBe(400);
          (postModel.findByIdAndUpdate as jest.Mock).mockRestore();
      });

      test("Post test - Update post that not exist", async () => {
        const response = await request(app)
          .put("/post/67447b032ce3164be7c4412d")
          .set({ authorization: "JWT " + token })
          .send({
            title: "new title",
            content: "new content",
            author: "new author",
          });
        expect(response.statusCode).toBe(404);
      });

      test("Post test - Update post without token", async () => {
        const response = await request(app)
          .put("/post/" + postId)
          .set({ authorization : "JWT" + ""})
          .send({
            title: "new title",
            content: "new content",
            author: "new author",
          });
        expect(response.statusCode).toBe(401);
      });

      test("Post test - Delete post", async () => {
        const response = await request(app)
          .delete("/post/" + postId)
          .set({ authorization: "JWT " + token });
        expect(response.statusCode).toBe(200);
      });

      test("Post test - Delete post error", async () => {
        jest.spyOn(postModel, 'findByIdAndDelete').mockImplementation(() => {
          throw new Error("Database error");
      });
          const response = await request(app)
            .delete("/post/" + postId)
            .set({ authorization: "JWT " + token });
          expect(response.statusCode).toBe(400);
          (postModel.findByIdAndDelete as jest.Mock).mockRestore();
      });

      test("Post test - Delete post that not exist", async () => {
        const response = await request(app)
          .delete("/post/67447b032ce3164be7c4412d")
          .set({ authorization: "JWT " + token });
        expect(response.statusCode).toBe(404);
      });

      test("Post test - Delete post without token", async () => {
        const response = await request(app)
          .delete("/post/" + postId)
          .set({ authorization: "JWT" + "" });
        expect(response.statusCode).toBe(401);
      });

      // New test -> check if all comment related delete as well
      test("Post test - Delete post and all comments related", async () => {
        const postResponse = await request(app)
          .post("/post")
          .set({ authorization: "JWT " + token })
          .send({
            title: "title",
            content: "content",
            author: "author",
          });
        expect(postResponse.statusCode).toBe(201);
        const postId = postResponse.body._id;
        const commentResponse = await request(app)
          .post("/comment")
          .set({ authorization: "JWT " + token })
          .send({
            PostId: postId,
            content: "content",
            author: "author",
          });
        expect(commentResponse.statusCode).toBe(201);
        const response = await request(app)
          .delete("/post/" + postId)
          .set({ authorization: "JWT " + token });
        expect(response.statusCode).toBe(200);
        const commentResponse2 = await request(app).get("/comment");
        expect(commentResponse2.statusCode).toBe(200);
        expect(commentResponse2.body).toHaveLength(0);
      });
    });