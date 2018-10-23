const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);
const url = process.env.MONGODB_URI;
mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);

module.exports = {
  mongoose
};
