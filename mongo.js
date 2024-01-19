

const mongoose = require('mongoose');


mongoose.connect("mongodb://0.0.0.0:27017/students")
.then(() => {
  console.log("MongoDB connection successful");
})
.catch((error) => {
  console.error("MongoDB connection failed:", error);
});



const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


const User =  mongoose.model('User', userSchema);

module.exports = User;
// mongodb+srv://arpit2134:le2cbndJXwO8Ru0d@cluster0.s9srvs6.mongodb.net/