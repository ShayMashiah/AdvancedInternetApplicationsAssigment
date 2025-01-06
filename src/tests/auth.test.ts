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
  await mongoose.connection.close();
});

describe("User test suite", () => {

  // Test get all users
  test("User test get all users", async () => {
    const response = await request(app).get("/auth");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("User test Create User", async () => {
    // Create a new user
    const newUser = {
        "email": "ShayMashiah@gmail.com",
        "password": "123456"
    };
    const response = await request(app).post("/auth/register").send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe("ShayMashiah@gmail.com");
    expect(response.body.password).toBe("123456");
   });
});