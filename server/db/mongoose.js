const mongoose = require("mongoose");

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp";
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(
  url,
  { useNewUrlParser: true }
);

module.exports = {
    mongoose
};