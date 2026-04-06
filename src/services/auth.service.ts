import prisma from "../db/prisma";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { RegisterInput, LoginInput } from "../schema/auth.schema";
import { UnauthorizedError, BadRequestError } from "../utils/errors";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"];

export const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new BadRequestError("Email is already in use");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  // If it's the first user, maybe make them ADMIN (optional, but good for demo)
  const count = await prisma.user.count();
  const role = count === 0 ? "ADMIN" : "VIEWER";

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role,
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || user.status !== "ACTIVE") {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};
