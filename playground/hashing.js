const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

let data = {
    id: 10
};

const token = jwt.sign(data, "123abc");
const decode = jwt.verify(token, "123abc");

console.log(decode);