const mongoose = require('mongoose')

const connectDB = () => {
  mongoose
    .connect('mongodb+srv://rahulgore575:Samu@4321@cluster0.xno60mp.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDB;
