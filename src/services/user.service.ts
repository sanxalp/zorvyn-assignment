import prisma from "../db/prisma";
import bcrypt from "bcrypt";
import { CreateUserInput, UpdateUserRoleInput } from "../schema/user.schema";
import { BadRequestError, NotFoundError } from "../utils/errors";

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
  return users;
};

export const createUser = async (data: CreateUserInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new BadRequestError("Email is already in use");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || "VIEWER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return user;
};

export const updateUserRole = async (id: string, data: UpdateUserRoleInput) => {
  const user = await prisma.user.findUnique({ where: { id } });
  
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(data.role && { role: data.role }),
      ...(data.status && { status: data.status }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return updatedUser;
};
