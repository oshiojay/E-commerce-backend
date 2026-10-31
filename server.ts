 import express from "express"
 import prisma from "./config/prisma"
 import cookieParser from "cookie-parser"
 import swaggerUi from "swagger-ui-express"
 import swagger from "./swagger"
 import cors from "cors"

import userRoutes from "./routes/user"
 const app = express()
 app.use(express.json())
 app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

 app.use(cookieParser())

 app.use('/apisDocs', swaggerUi.serve, swaggerUi.setup(swagger))

 app.use('/api/v1', userRoutes)
 const PORT = process.env.PORT

 const databaseConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error("unable to connect to database:", error);
    process.exit(1);
  }
};

databaseConnection();