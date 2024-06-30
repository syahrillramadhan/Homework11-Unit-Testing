import request from "supertest";
import { app } from "../src/server.js";
import { prisma } from "../src/config/db.js";

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe("User API", () => {
  let accessToken;

  it("Should register a new user", async () => {
    const userData = {
      name: "makima",
      email: "makima@mail.com",
      password: "password",
      role: "admin",
    };

    const response = await request(app).post("/api/register").send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Register Success");
    expect(response.body.newUser).toMatchObject({
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
  });

  it("Should handle invalid input", async () => {
    const invalidUserData = {
      name: "",
      email: "",
      password: "",
      role: "",
    };

    const response = await request(app)
      .post("/api/register")
      .send(invalidUserData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid Input" });
  });

  it("Should handle existing user", async () => {
    const existingUserData = {
      name: "makima",
      email: "makima@mail.com",
      password: "password",
      role: "admin",
    };

    await prisma.user.findUnique({
      where: {
        email: existingUserData.email,
      },
    });

    const response = await request(app)
      .post("/api/register")
      .send(existingUserData);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "Email Already Use" });
  });

  it("Should login successfully and return access token", async () => {
    const loginData = {
      email: "makima@mail.com",
      password: "password",
    };

    const response = await request(app)
      .post("/api/login")
      .send(loginData)
      .expect(200);

    expect(response.body).toHaveProperty("message", "Login Success");
    expect(response.body).toHaveProperty("accessToken");
    accessToken = response.body.accessToken;
  });

  it("Should return 400 if email or password is missing", async () => {
    const incompleteCredentials = {
      email: "test@example.com",
    };

    const response = await request(app)
      .post("/api/login")
      .send(incompleteCredentials)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Invalid Input");
  });

  it("Should return 401 if invalid credentials are provided", async () => {
    const invalidCredentials = {
      email: "nonexistent@example.com",
      password: "invalidpassword",
    };

    const response = await request(app)
      .post("/api/login")
      .send(invalidCredentials)
      .expect(401);

    expect(response.body).toHaveProperty("message", "Invalid Credentials");
  });

  it("Should update user data and return success message", async () => {
    const updatedUserData = {
      name: "budi-kun",
      email: "budi@mail.com",
      password: "newpassword",
      role: "admin",
    };

    const response = await request(app)
      .put("/api/edit/user")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedUserData)
      .expect(200);

    expect(response.body).toHaveProperty("message", "Update User Success");
    expect(response.body).toHaveProperty("editUser");
    expect(response.body.editUser).toMatchObject({
      name: "budi-kun",
      email: "budi@mail.com",
      role: "admin",
    });
  });

  it("Should return 400 if required fields are missing", async () => {
    const incompleteUserData = {
      email: "budi@mail.com",
      password: "newpassword",
    };

    const response = await request(app)
      .put("/api/edit/user")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(incompleteUserData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Invalid Input");
  });

  it("Should return 409 if email is already in use", async () => {
    const userDataWithExistingEmail = {
      name: "budi-kun",
      email: "budi@mail.com",
      password: "password",
      role: "admin",
    };

    const response = await request(app)
      .put("/api/edit/user")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(userDataWithExistingEmail)
      .expect(409);

    expect(response.body).toHaveProperty("message", "Email Already Use");
  });

  it("Should delete user and return success message", async () => {
    const response = await request(app)
      .delete("/api/delete")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty("message", "Delete User Success");
  });
});
