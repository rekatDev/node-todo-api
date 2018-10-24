const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("../../models/todo");
const { User } = require("../../models/user");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
  {
    _id: userOneId,
    email: "test@example.com",
    password: "userOnePW",
    tokens: [
      {
        access: "auth",
        token: jwt.sign(
          {
            _id: userOneId,
            access: "auth"
          },
          process.env.JWT_SECRET
        )
      }
    ]
  },
  {
    _id: userTwoId,
    email: "test2@example.com",
    password: "userTwoPW",
    tokens: [
        {
          access: "auth",
          token: jwt.sign(
            {
              _id: userTwoId,
              access: "auth"
            },
            process.env.JWT_SECRET
          )
        }
      ]
  }
];

const todos = [
  {
    _id: new ObjectID(),
    text: "First test todo",
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: 33,
    _creator: userTwoId
  }
];

const populateUsers = done => {
  User.deleteMany({})
    .then(() => {
      let userOne = new User(users[0]).save();
      let userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

const populateTodos = done => {
  Todo.deleteMany({})
    .then(result => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
};

module.exports = {
  populateTodos,
  todos,
  users,
  populateUsers
};
