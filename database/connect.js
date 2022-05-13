const mongoose = require("mongoose");
const config = require(`${process.cwd()}/config.json`);

async function connect() {
  mongoose.connect(process.env.mongooseConnectionString || config.mongooseConnectionString, {
    
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  mongoose.connection.once("open", () => {
    console.log("Loaded Mongoose DB");
  });
  return;
}

module.exports = connect;