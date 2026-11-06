 import express from "express"
 import prisma from "./config/prisma"
 import cookieParser from "cookie-parser"
 import swaggerUi from "swagger-ui-express"
 import swagger from "./swagger"
 import cors from "cors"

import userRoutes from "./routes/user"
import adminRoutes from "./routes/admin"
import productRoutes from "./routes/product"

 const app = express()
 app.use(express.json())
 const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://e-commerce-backend-0l5v.onrender.com",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

 app.use(cookieParser())

 app.use('/apisDocs', swaggerUi.serve, swaggerUi.setup(swagger))

 app.use('/api/v1', userRoutes)
 app.use('/api/v1/admin', adminRoutes)
 app.use('/api/v1/product', productRoutes)
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