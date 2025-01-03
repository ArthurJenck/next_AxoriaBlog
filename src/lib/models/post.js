import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    markdownArticle: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
)

export const Post = mongoose.models?.Post || mongoose.model("Post", postSchema)
