// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");


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

    // db.collection("Todos").insertOne(
    //   {
    //     text: "Send infos!",
    //     completed: false
    //   },
    //   (err, result) => {
    //     if (err) {
    //       console.log("Unable to insert todo", err);
    //       return;
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //   }
    // );

    // db.collection("Users").insertOne(
    //   {
    //     name: "Sven",
    //     age: 27,
    //     location: "DE"
    //   },
    //   (err, result) => {
    //     if (err) {
    //       return console.log("Unable to insert User", err);
    //     }
    //   }
    // );

    client.close();
  }
);
