import prisma from "../db/prisma";
import { CreateRecordInput, UpdateRecordInput, GetRecordsQueryInput } from "../schema/record.schema";
import { NotFoundError } from "../utils/errors";
import { Prisma } from "@prisma/client";

export const getRecords = async (query: GetRecordsQueryInput) => {
  const { startDate, endDate, type, category, page = 1, limit = 10 } = query;
  
  const whereInfo: Prisma.RecordWhereInput = {};
  
  if (startDate || endDate) {
    whereInfo.date = {};
    if (startDate) whereInfo.date.gte = new Date(startDate);
    if (endDate) whereInfo.date.lte = new Date(endDate);
  }
  if (type) whereInfo.type = type;
  if (category) whereInfo.category = { contains: category };

  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where: whereInfo,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    }),
    prisma.record.count({ where: whereInfo }),
  ]);

  return {
    data: records,
    metadata: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRecordById = async (id: string) => {
  const record = await prisma.record.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } } }
  });
  if (!record) throw new NotFoundError("Record not found");
  return record;
};

export const createRecord = async (userId: string, data: CreateRecordInput) => {
  return prisma.record.create({
    data: {
      ...data,
      date: new Date(data.date),
      userId,
    },
  });
};

export const updateRecord = async (id: string, data: UpdateRecordInput) => {
  const record = await prisma.record.findUnique({ where: { id } });
  if (!record) throw new NotFoundError("Record not found");

  return prisma.record.update({
    where: { id },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
    },
  });
};

export const deleteRecord = async (id: string) => {
  const record = await prisma.record.findUnique({ where: { id } });
  if (!record) throw new NotFoundError("Record not found");

  await prisma.record.delete({ where: { id } });
};
