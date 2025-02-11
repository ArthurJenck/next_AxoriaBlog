"use client"
import { addPost } from "@/lib/serverActions/blog/postServerActions"
import { useRouter } from "next/navigation"
import React, { useRef, useState } from "react"

const page = () => {
  const [tags, setTags] = useState([])

  const router = useRouter()

  const tagInputRef = useRef(null)
  const submitBtnRef = useRef(null)
  const serverValidationText = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    formData.set("tags", JSON.stringify(tags))
    // console.log(formData)

    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value)
    // }

    serverValidationText.current.textContent = ""
    submitBtnRef.current.textContent = "Saving Post..."
    submitBtnRef.current.disabled = true

    try {
      const result = await addPost(formData)

      if (result.success) {
        submitBtnRef.current.textContent = "Post Saved ✅"
        let countdown = 3
        serverValidationText.current.textContent = `Redirecting in ${countdown}...`

        const interval = setInterval(() => {
          countdown -= 1
          serverValidationText.current.textContent = `Redirecting in ${countdown}...`

          if (countdown === 0) {
            clearInterval(interval)
            router.push(`/article/${result.slug}`)
          }
        }, 1000)
      }
    } catch (error) {
      submitBtnRef.current.textContent = "Submit"
      submitBtnRef.current.disabled = false
      serverValidationText.current.textContent = `${error.message}`
      console.error("Error while creating post:", error)
    }
  }

  const handleAddTag = () => {
    const newTag = tagInputRef.current.value.trim().toLowerCase()
    if (newTag !== "" && !tags.includes(newTag) && tags.length <= 4) {
      setTags([...tags, newTag])
      tagInputRef.current.value = ""
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleEnterOnTagInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="u-main-container bg-white p-7 mt-32 mb-44">
      <h1 className="text-4xl mb-4">Write an article 📝</h1>

      <form onSubmit={handleSubmit} className="pb-6">
        <label htmlFor="title" className="f-label">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="shadow border rounded w-full p-3 mb-7 text-gray-700 focus:outline-slate-400"
          placeholder="Title"
          required
        />

        <div className="mb-10">
          <label className="f-label" htmlFor="tag">
            Add a tag(s) (optional, max5)
          </label>
          <div className="flex">
            <input
              type="text"
              className="shadow border rounded p-3 text-gray-700 focus:outline-slate-400"
              name="tag"
              id="tag"
              placeholder="add a tag"
              ref={tagInputRef}
              onKeyDown={handleEnterOnTagInput}
            />
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-4 rounded mx-4"
              onClick={handleAddTag}
              type="button"
            >
              Add
            </button>
            <div className="flex items-center grow whitespace-normal overflow-y-auto shadow border rounded px-3">
              {tags.map((tag) => {
                return (
                  <span
                    key={tag}
                    className="inline-block whitespace-nowrap bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-500 ml-2"
                    >
                      &times;
                    </button>
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        <label htmlFor="markdownArticle" className="f-label">
          Write your article using Markdown - do not repeat the title above
        </label>
        <a
          href="https://www.markdownguide.org/cheat-sheet/"
          target="_blank"
          className="block mb-4 text-blue-600"
        >
          How to use Markdown syntax ?
        </a>
        <textarea
          name="markdownArticle"
          id="markdownArticle"
          required
          className="min-h-44 text-xl shadow appearance-none border rounded w-full p-8 text-gray-700 mb-4 focus:outline-slate-400"
        ></textarea>
        <button
          ref={submitBtnRef}
          className="min-w-44 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded border-none mb-4 "
        >
          Submit
        </button>
        <p ref={serverValidationText}></p>
      </form>
    </div>
  )
}

export default page
