if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
// const cors = require("cors");
const mongoose = require("mongoose");
const campgroundRoutes = require("./routes/campgrounds-routes");
const reviewRoutes = require("./routes/reviews-routes");
const ExpressError = require("./utils/ExpressError");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/pinoycamp";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use(express.json());

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.use((req, res, next) => {
  const error = new ExpressError("Page not found.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  const { status = 500, message = "Something went wrong." } = error;
  res.status(status).send({ message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serving on port: ${port}`);
});
