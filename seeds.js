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
      location: "Mayon Volcano, Albay",
      geometry: {
        type: "Point",
        coordinates: [123.711204, 13.06527],
      },
      author: "60bc6b344fa02a3d581bfa50", // user id
      images: [
        {
          url: "https://res.cloudinary.com/dzfkuznwb/image/upload/v1622783080/PinoyCamp/xolu9xitmcu71zg3nigm.jpg",
          filename: "PinoyCamp/xolu9xitmcu71zg3nigm",
        },
        {
          url: "https://res.cloudinary.com/dzfkuznwb/image/upload/v1622783080/PinoyCamp/orr0vwgyg5ai7bbbjvio.jpg",
          filename: "PinoyCamp/orr0vwgyg5ai7bbbjvio",
        },
      ],
    });
    for (let j = 0; j < 3; j++) {
      const review = new Review({
        body: `This is a review ${j + 1}`,
        rating: j + 3,
        author: "60bc6b344fa02a3d581bfa50",
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
