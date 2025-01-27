import { Post } from "@/lib/models/post"
import { connectToDb } from "@/lib/utils/db/connectToDb"

export const getPost = async (slug) => {
  try {
    await connectToDb()

    const post = await Post.findOne({ slug })
    return post
  } catch (error) {
    console.error("Error while fetching post", error)
    throw new Error("Failed to fetch post", error.message)
  }
}
