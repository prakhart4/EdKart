import mongoose from "mongoose";

// Define mongoose schemas
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

export const User =
  mongoose?.models?.User || mongoose.model("User", userSchema);
