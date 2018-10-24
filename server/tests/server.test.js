const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");
const { populateTodos, todos, users, populateUsers } = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
  it("should create a new todo", done => {
    let text = "Test todo text";

    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({
        text
      })
      .expect(201)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });
  it("should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });
});

describe("GET /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should delete a todo", done => {
    const id = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then(todo => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });

  it("should not delete a todo", done => {
    const id = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then(todo => {
            expect(todo).toBeTruthy();
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });

  it("should return a 404 if todo not found", done => {
    const id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return a 404 if ObjectID is invalid", done => {
    const id = "123abc";
    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("should update a todo to completed", done => {
    const id = todos[0]._id.toHexString();
    const text = "This is the new text";
    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe("number");
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then(todo => {
            expect(todo.text).toBe(text);
            expect(todo.completed).toBe(true);
            expect(typeof todo.completedAt).toBe("number");
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });

  it("should note update a todo to completed", done => {
    const id = todos[0]._id.toHexString();
    const text = "This is the new text";
    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then(todo => {
            expect(todo.text).not.toBe(text);
            expect(todo.completed).not.toBe(true);
            expect(todo.completedAt).toBeFalsy();
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });

  it("should update a todo to incomplete", done => {
    const id = todos[1]._id.toHexString();
    const text = "new text!!";

    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then(todo => {
            expect(todo.text).toBe(text);
            expect(todo.completed).toBe(false);
            expect(todo.completedAt).toBeFalsy();
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });

  it("should return a 404 if ObjectID is invalid", done => {
    const id = "123abc";
    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .send({
        completed: false
      })
      .expect(404)
      .end(done);
  });
});

describe("GET /users/me", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return a 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create a user", done => {
    let email = "example@example.com";
    let password = "123mbe!";
    request(app)
      .post("/users")
      .send({
        email,
        password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeDefined();
        expect(res.body.email).toBe(email);
        expect(res.body._id).toBeDefined();
      })
      .end(err => {
        if (err) {
          return done(err);
        }
        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it("should return validation error if req invalid", done => {
    let email = "examplexample.com";
    let password = "123mbe!";
    request(app)
      .post("/users")
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);
  });

  it("should not create user if email in use", done => {
    let email = "test@example.com";
    let password = "123mbe!";
    request(app)
      .post("/users")
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);
  });
});

describe("POST /users/login", () => {
  it("should login user and return auth-token", done => {
    let email = users[0].email;
    let password = users[0].password;
    let id = users[0]._id;
    request(app)
      .post("/users/login")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeDefined();
        expect(res.body.email).toBe(email);
        expect(res.body._id).toBe(id.toHexString());
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(id)
          .then(user => {
            expect(user.tokens[1]).toMatchObject({
              access: "auth",
              token: res.headers["x-auth"]
            });
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it("should reject invalid login credentials", done => {
    let email = users[0].email;
    let password = users[0].password + 1;
    let id = users[0]._id;
    request(app)
      .post("/users/login")
      .send({ email, password })
      .expect(400)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeUndefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
});

describe("DELETE /users/me/token", () => {
  it("should logout a user and remove the token", (done) => {
    request(app)
    .delete("/users/me/token")
    .set("x-auth", users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      User.findById(users[0]._id).then(user => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch(e => {
        done(e);
      });
    })
  });
});
