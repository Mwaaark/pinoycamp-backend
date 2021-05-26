const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Review = require("./models/review");

mongoose.connect("mongodb://localhost:27017/pinoycamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < 6; i++) {
    const campground = new Campground({
      title: `Lorem ipsum dolor sit amet ${i + 1}`,
      description:
        "Sed iaculis volutpat arcu, sed fringilla ligula scelerisque vel. Curabitur dignissim dapibus scelerisque. In interdum massa sed tellus mattis, et aliquam libero varius. Vivamus sagittis pellentesque risus non lacinia. Duis augue metus, lacinia eget massa id, hendrerit suscipit turpis. Sed sodales leo at aliquam viverra.",
      location: "Chocolate Hills",
      image:
        "https://images.unsplash.com/photo-1591506578484-d496b18a6908?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
    });
    for (let j = 0; j < 3; j++) {
      const review = new Review({
        body: `This is a review ${j + 1}`,
        rating: j + 3,
      });

      campground.reviews.push(review);
      await review.save();
    }

    await campground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
