import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  username: String,
  mobile: Number,
  followers: {
    type: Array,
    default: [],
  },
  followings: {
    type: Array,
    default: [],
  },
});
export const User = mongoose.model("mediauser", UserSchema);
