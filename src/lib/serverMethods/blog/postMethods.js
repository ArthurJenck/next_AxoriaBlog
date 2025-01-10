import { Post } from "@/lib/models/post"
import { connectToDb } from "@/lib/utils/db/connectToDb"

export const getPost = async (slug) => {
  try {
    await connectToDb()

    const post = await Post.findOne({ slug })

    return post
  } catch (error) {
    console.error("An error occured while fetching post", error)
    throw new Error(error.message || "Failed to fetch post")
  }
}
