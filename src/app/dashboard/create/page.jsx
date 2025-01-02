"use client"
import React from "react"

const handleSubmit = (e) => {
  e.preventDefault()
}

const page = () => {
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
          className="shadow border rounded w-full p-3 mb-7 text-gray-700"
          placeholder="Title"
          required
        />
      </form>
    </div>
  )
}

export default page
