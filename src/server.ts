import { app } from "./app";
import { PrismaClient } from "@prisma/client";

const port = process.env.PORT || 3000;

const startServer = () => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
