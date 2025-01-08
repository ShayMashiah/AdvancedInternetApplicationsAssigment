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
  });

  test("User test Create User - User already exists", async () => {
    // Create a new user
    const newUser = {
        "email": "ShayMashiah@gmail.com",
        "password": "12345678"
    };
    const response = await request(app).post("/auth/register").send(newUser);
    expect(response.statusCode).toBe(400);
  });

  test("User test Create User - Missing email", async () => {
    // Create a new user
    const newUser = {
        "password": "123456"
    };
    const response = await request(app).post("/auth/register").send(newUser);
    expect(response.statusCode).toBe(400);
  });

  test("User test Create User - Missing password", async () => {
    // Create a new user
    const newUser = {
        "email": "ShayMashiah@gmail.com"
    }
    const response = await request(app).post("/auth/register").send(newUser);
    expect(response.statusCode).toBe(400);
  });

  test("User test Login sucsessed", async () => {
    // Login a user
    const user = {
        "email": "ShayMashiah@gmail.com",
        "password": "123456"
    };
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
  });

  test("User test Login - User does not exist", async () => {
    // Login a user
    const user = {
        "email": "Omriivri@gmail.com",
        "password": "123456"
    };
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(404);
  });

  test("User test - Invalid password ", async () => {
    // Login a user
    const user = {
        "email": "ShayMashiah@gmail.com",
        "password": "12345678"
    };
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(400);
  });

});