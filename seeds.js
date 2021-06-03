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
      author: "60af66b05089f72004a5a03b",
      images: [
        {
          url: "https://res.cloudinary.com/dzfkuznwb/image/upload/v1622633258/PinoyCamp/vnijx6lgdfjzbudtyo6r.jpg",
          filename: "PinoyCamp/vnijx6lgdfjzbudtyo6r",
        },
        {
          url: "https://res.cloudinary.com/dzfkuznwb/image/upload/v1622633258/PinoyCamp/i9sch3cya3q2k6ncrz5x.jpg",
          filename: "PinoyCamp/i9sch3cya3q2k6ncrz5x",
        },
      ],
    });
    for (let j = 0; j < 3; j++) {
      const review = new Review({
        body: `This is a review ${j + 1}`,
        rating: j + 1,
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
