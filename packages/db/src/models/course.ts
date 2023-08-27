import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageLink: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // authorName: { type: String },
  // category: { type: String },
  published: { type: Boolean, required: true },
});

export const Course =
  mongoose?.models?.Course || mongoose.model("Course", courseSchema);
