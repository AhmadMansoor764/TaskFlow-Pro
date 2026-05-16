import mongoose from "mongoose";

const personInfo = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  streak: {
    type: Number,
    default: 0,
  },

  badge: {
    type: String,
    default: "No Badge",
  },

  achievement: {
    type: String,
    default: "Start completing tasks",
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const Person = mongoose.model("Person", personInfo);

export default Person;
