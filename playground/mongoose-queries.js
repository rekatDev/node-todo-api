const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

let id = "5bcdcd81b36c300134ee2ecb";

User.findById(id)
  .then(user => {
    if (!user) {
      console.log("Unable to find user");
    }

    console.log("User find by ID", user);
  })
  .catch(err => {
    console.log("ID is invalid", err);
  });

// let newUser = new User({
//   email: "wurst@wurst.de"
// });

// newUser.save().then(
//   result => {
//     console.log(result);
//   },
//   err => {
//     console.log("Can't create user", err);
//   }
// );

// let id = "5bcdca7c8be4241038eb47bdd";

// if (!ObjectID.isValid(id)) {
//     console.log("ID is not valid");
// }

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log("Todos", todos);
// });

// Todo.findOne({
//   completed: false
// }).then(todo => {
//   console.log("Todo", todo);
// });

// Todo.findById(id)
//   .then(todo => {
//     if (!todo) {
//       return console.log("Id not found");
//     }
//     console.log("Todo by id", todo);
//   })
//   .catch(e => console.log(e));
