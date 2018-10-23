const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// Todo.findByIdAndDelete("5bcedbb926a7e32fe995e46f").then(todo => {
//     console.log(todo);
// });

// Todo.findOneAndDelete({_id: "5bcedbb926a7e32fe995e46f"}).then(todo => {
//     console.log(todo);
// });
