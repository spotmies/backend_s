const mongoose = require("mongoose");

const connectdb = async () => {
  const dburi =
    "mongodb+srv://spotmies:spotmies1230@cluster0.x4elk.mongodb.net/spotmiesDB?retryWrites=true&w=majority";
  mongoose
    .connect(dburi, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then((result) => console.log("mongodb connected"))
    .catch((err) => console.log(err));
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
};

module.exports = connectdb;
