const mongoose = require("mongoose");
const uuid = require("uuid");

const Schema = mongoose.Schema;
// const ObjectId = mongoose.ObjectId;

const BlogSchema = new Schema(
  {
    
   
    title: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    tags: {
      type: Array,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
      enum: ["draft", "published"],
      default: "draft",
    },

    read_count: {
      type: Number,
      default: 0,
    },

    reading_time: {
      type: Number,
    },

    body: {
      type: String,
      required: true,
      unique: true,
    },

    user_id: {
      type: String,
      default: uuid.v4(),
      required: true,
      ref: "users",
    },
  },
  { timestamps: true }
);

const BlogModel = mongoose.model('blogs', BlogSchema)
module.exports = BlogModel
