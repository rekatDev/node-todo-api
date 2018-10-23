const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

let password = "123abc!";

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

let hashedPassword = "$2a$10$uC8gtSaiBBYMkoEYn0QKWucEuAcC.jdzn9rxY/6ORUlhyw.EPjHFa";

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

// let data = {
//     id: 10
// };

// const token = jwt.sign(data, "123abc");
// const decode = jwt.verify(token, "123abc");

// console.log(decode);