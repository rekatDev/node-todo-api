// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      console.log("Unable to connect to MongoDB server");
      return;
    }
    console.log("Connected to MongoDB server");

    const db = client.db("TodoApp");

    db.collection("Users")
      .findOneAndUpdate(
        {
          _id: new ObjectID("5bc9e0aa9db8881f2467b1c2")
        },
        {
          $set: {
            name: "Hans"
          },
          $inc: {
            age: 1
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(
        result => {
          console.log(result);
        },
        err => {
          console.log("Unable to update todos", err);
        }
      );
    // db.collection("Todos")
    //   .findOneAndUpdate({
    //     _id: new ObjectID("5bcda0bd914f2e0b969ed4e9")
    //   }, {
    //     $set: {
    //       completed: true
    //     }
    //   }, {
    //     returnOriginal: false
    //   })
    //   .then(
    //     result => {
    //       console.log(result);
    //     },
    //     err => {
    //       console.log("Unable to update todos", err);
    //     }
    //   );

    // client.close();
  }
);
