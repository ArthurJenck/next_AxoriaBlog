import mongoose from "mongoose"
import slugify from "slugify"

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    markdownArticle: { type: String, required: true },
    markdownHTMLResult: { type: String, required: true },
    slug: { type: String, unique: true },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
      }
    ]
  },
  { timestamps: true }
)

postSchema.pre("save", async function (next) {
  if (!this.slug) {
    const ogSlugCandidate = slugify(this.title, { lower: true, strict: true })

    let slugExists = await mongoose.models.Post.findOne({
      slug: ogSlugCandidate
    })
    let slugCandidate = ogSlugCandidate

    let counter = 1
    while (slugExists) {
      slugCandidate = `${ogSlugCandidate}-${counter}`
      slugExists = await mongoose.models.Post.findOne({ slug: slugCandidate })
      counter++
    }

    this.slug = slugCandidate
    next()
  }
})

export const Post = mongoose.models?.Post || mongoose.model("Post", postSchema)
