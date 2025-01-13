import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import userModel from "../models/userModel";
import { Express } from "express";


let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await userModel.deleteMany();
});

afterAll(async () => {
  console.log("afterAll");
  await userModel.deleteMany();
  await mongoose.connection.close();
});

type UserInfo = {
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  _id?: string;
};
const newUser: UserInfo = {
  email: "ShayMashiah@gmail.com",
  password: "123456"
}

describe("User test suite", () => {

  // Test get all users
  test("User test get all users", async () => {
    const response = await request(app).get("/auth");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("User test Create User", async () => {
    const response = await request(app).post("/auth/register").send(newUser);
    expect(response.statusCode).toBe(201);
  });

  test("User test Create User - User already exists", async () => {
    // Create a new user
    const user = {
        "email": "ShayMashiah@gmail.com",
        "password": "12345678"
    };
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(400);
  });

  test("User test Create User - Missing email", async () => {
    const user = {
        "password": "123456"
    };
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(400);
  });

  test("User test Create User - Missing password", async () => {
    const user = {
        "email": "ShayMashiah@gmail.com"
    }
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(400);
  });

  test("User test Login sucsessed", async () => {
    // Login a user
    const response = await request(app).post("/auth/login").send(newUser);
    expect(response.statusCode).toBe(200);
    newUser.accessToken = response.body.accessToken;
    expect(newUser.accessToken).toBeDefined();
    newUser.refreshToken = response.body.refreshToken;
    expect(newUser.refreshToken).toBeDefined();
  });

  test("User test - Make sure two access tokens are not the same", async () => {
    const response = await request(app).post("/auth/login").send(newUser);
    expect(response.body.accessToken).not.toBe(newUser.accessToken);
  });

  test("User test Login - User does not exist", async () => {
    // Login a user
    const user = {
        "email": "Omriivri@gmail.com",
        "password": "123456"
    };
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(404);
    const accessToken = response.body.accessToken;
    expect(accessToken).toBeUndefined();
    const refreshToken = response.body.refreshToken;
    expect(refreshToken).toBeUndefined();
  });

  test("User test - Invalid password ", async () => {
    // Login a user
    const user = {
        "email": "ShayMashiah@gmail.com",
        "password": "12345678"
    };
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(400);
    const accessToken = response.body.accessToken;
    expect(accessToken).toBeUndefined();
    const refreshToken = response.body.refreshToken;
    expect(refreshToken).toBeUndefined();
  });

  // Test refresh token - get a new access and refresh token
  test("Refresh token", async () => {
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: newUser.refreshToken
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    newUser.accessToken = response.body.accessToken;
    newUser.refreshToken = response.body.refreshToken;
  });

  // Test logout - delete the refresh token and verify that the refresh token is not valid anymore
  test("Logout", async () => {
    const response = await request(app).post("/auth/logout").send({
      refreshToken: newUser.refreshToken
    });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: newUser.refreshToken
    });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Login after logout", async () => {
    const response = await request(app).post("/auth/login").send(newUser);
    expect(response.statusCode).toBe(200);
    newUser.accessToken = response.body.accessToken;
    newUser.refreshToken = response.body.refreshToken;
    expect(newUser.accessToken).toBeDefined();
    expect(newUser.refreshToken).toBeDefined();
  });



  test("Refresh token multiple times", async () => {
    // Create a new user
    const secondUser: UserInfo = {
        email: "Omriivri@gmail.com",
        password: "123456"
    };
    await request(app).post("/auth/register").send(secondUser);
    // Login a user - get a new refresh token
    const response = await request(app).post("/auth/login").send(secondUser);
    expect(response.statusCode).toBe(200);
    newUser.accessToken = response.body.accessToken;
    newUser.refreshToken = response.body.refreshToken;

    // First time use the refresh token and get a new one
    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: newUser.refreshToken
    });
    expect(response2.statusCode).toBe(200);
    const newRefreshToken = response2.body.refreshToken;

    // Try to use the old refresh token expect to fail
    const response3 = await request(app).post("/auth/refresh").send({
      refreshToken: newUser.refreshToken
    });
    expect(response3.statusCode).not.toBe(200);

    // Try to use the new refresh token and expect to fail because of perivous attempt
    const response4 = await request(app).post("/auth/refresh").send({
      refreshToken: newRefreshToken
    });
    expect(response4.statusCode).not.toBe(200);
  });

  // New timeout to adjust to swagger
  // Test timeout on refresh token
  jest.setTimeout(50000);
  test("Timeout on refresh token", async () => {
    // Create a new user
    const slowUser: UserInfo = {
        email: "SlowUser@gmail.com",
        password: "123456"
    };
    await request(app).post("/auth/register").send(slowUser);
    // Login a user - get a new refresh token
    const LoginResponse = await request(app).post("/auth/login").send(slowUser);
    expect(LoginResponse.statusCode).toBe(200);
    slowUser.accessToken = LoginResponse.body.accessToken;
    slowUser.refreshToken = LoginResponse.body.refreshToken;

    await new Promise(resolve => setTimeout(resolve, 40000));
    const response = await request(app).post("/post")
    .set({ authorization: "JWT " + slowUser.accessToken })
    .send({
      title: "Will FAIL !",
      content: "Because access token is expired",
      author: "Shay Mashiah",
    });
    expect(response.statusCode).not.toBe(201);

    // Refresh the token
    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: slowUser.refreshToken
    });
    expect(response2.statusCode).toBe(200);
    slowUser.accessToken = response2.body.accessToken;
    slowUser.refreshToken = response2.body.refreshToken;

    // Try to create a new post after the token is refreshed
    const response3 = await request(app).post("/post")
    .set({ authorization: "JWT " + slowUser.accessToken })
    .send({
      title: "Will SUCSESS !",
      content: "Because access token is refreshed",
      author: "Shay Mashiah",
    });
    expect(response3.statusCode).toBe(201);
    expect(response3.body.title).toBe("Will SUCSESS !");
    expect(response3.body.content).toBe("Because access token is refreshed");
    expect(response3.body.author).toBe("Shay Mashiah");
  });
});