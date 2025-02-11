import Link from "next/link"
import React from "react"

const page = () => {
  return (
    <form className="max-w-md mx-auto mt-32">
      <label htmlFor="userName" className="f-label">
        Name or pseudo
      </label>
      <input
        type="text"
        name="username"
        id="userName"
        placeholder="Name or pseudo"
        required
        className="f-auth-input"
      />
      <label htmlFor="email" className="f-label">
        E-mail
      </label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="E-mail"
        required
        className="f-auth-input"
      />
      <label htmlFor="password" className="f-label">
        Password
      </label>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Your password"
        required
        className="f-auth-input"
      />
      <label htmlFor="confirmPassword" className="f-label">
        Confirm password
      </label>
      <input
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirm password"
        required
        className="f-auth-input block"
      />

      <button className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 rounded mt-10 mb-5">
        Submit
      </button>
      <Link
        href="/signin"
        className="mb-10 underline text-blue-600 block text-center"
      >
        Already have an account ? Log in
      </Link>
    </form>
  )
}

export default page
