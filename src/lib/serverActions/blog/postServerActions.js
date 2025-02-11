"use server"
import { Post } from "@/lib/models/post"
import { Tag } from "@/lib/models/tags"
import { connectToDb } from "@/lib/utils/db/connectToDb"
import { marked } from "marked"
import slugify from "slugify"
import { JSDOM } from "jsdom"
import createDOMPurify from "dompurify"
import Prism from "prismjs"
import { markedHighlight } from "marked-highlight"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-css"
import "prismjs/components/prism-javascript"

const window = new JSDOM("").window
const DOMPurify = createDOMPurify(window)

export const addPost = async (formData) => {
  const { title, markdownArticle, tags } = Object.fromEntries(formData)

  try {
    await connectToDb()

    // Tags management
    const tagNamesArray = JSON.parse(tags)

    const tagIds = await Promise.all(
      tagNamesArray.map(async (tagName) => {
        const normalizedTagName = tagName.trim().toLowerCase()

        let tag = await Tag.findOne({ name: normalizedTagName })

        if (!tag) {
          tag = await Tag.create({
            name: normalizedTagName,
            slug: slugify(normalizedTagName, { strict: true })
          })

          return tag._id
        }
      })
    )

    // Markdown Management
    marked.use(
      markedHighlight({
        highlight: (code, language) => {
          const validLanguage = Prism.languages[language]
            ? language
            : "plaintext"

          return Prism.highlight(
            code,
            Prism.languages[validLanguage],
            validLanguage
          )
        }
      })
    )

    let markdownHTMLResult = marked(markdownArticle)
    markdownHTMLResult = DOMPurify.sanitize(markdownHTMLResult)

    const newPost = new Post({
      title,
      markdownArticle,
      markdownHTMLResult,
      tags: tagIds
    })

    const savedPost = await newPost.save().then(console.log("Post saved"))
    return { success: true, slug: savedPost.slug }
  } catch (error) {
    console.error("Error while creating post:", error)
    throw new Error(error.message || "An error occured while creating post")
  }
}
