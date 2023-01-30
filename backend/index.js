import * as dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

// PRimsa Client
const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      comments: true,
      likes: true,
    },
  });
  console.dir(allUsers, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Bip Bip .. Server is running on PORT ${PORT}`);
});
