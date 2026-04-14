import express from "express";
// import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.js";
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js";
import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js";
import { kpis, products, transactions } from "./data/data.js";

//app.use(
//    cors({
//        origin: [""],
//        methods: ["POST", "GET", "DELETE"],
//        credentials: true,
//    })
//);

/* CONFIGURATIONS */
/* CONFIGURATIONS */
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);

/* PORT FIX ✅ */
const PORT = process.env.PORT || 9000;
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* MONGOOSE SETUP */
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
  console.log("✅ MongoDB Connected");

  if ((await KPI.countDocuments()) === 0) {
    await KPI.insertMany(kpis);
  }

  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(products);
  }

  if ((await Transaction.countDocuments()) === 0) {
    await Transaction.insertMany(transactions);
  }

  app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
})