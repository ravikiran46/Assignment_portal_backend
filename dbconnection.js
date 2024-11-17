const mongoose = require("mongoose");

async function dbconnection(URI) {
  if (URI !== "") {
    await mongoose.connect(URI);
  } else {
    console.log("Provide Mongodb URI");
  }
}

module.exports = dbconnection;
