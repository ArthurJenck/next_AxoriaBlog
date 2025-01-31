import { Post } from "@/lib/models/post"
import { connectToDb } from "@/lib/utils/db/connectToDb"
import { Tag } from "@/lib/models/tags"

export const getPost = async (slug) => {
  try {
    await connectToDb()

    const post = await Post.findOne({ slug }).populate({
      path: "tags",
      select: "name slug"
    })
    return post
  } catch (error) {
    console.error("Error while fetching post", error)
    throw new Error("Failed to fetch post", error.message)
  }
}

export const getPosts = async () => {
  try {
    await connectToDb()

    const posts = await Post.find()
    return posts
  } catch (error) {
    console.error("Failed to get posts")
    throw new Error("An error occurred while getting posts", error.message)
  }
}
