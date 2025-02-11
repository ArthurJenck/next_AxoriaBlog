"use client"
import { register } from "@/lib/serverActions/session/sessionServerActions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useRef } from "react"

const page = () => {
  const serverInfoRef = useRef(null)
  const submitBtnRef = useRef(null)

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    serverInfoRef.current.classList.add("hidden")
    serverInfoRef.current.textContent = ""
    submitBtnRef.current.textContent = "Saving user..."
    submitBtnRef.current.disabled = true

    try {
      const result = await register(new FormData(e.target))

      if (result.success) {
        submitBtnRef.current.textContent = "User created ✅"

        let countdown = 3
        serverInfoRef.current.classList.remove("hidden")
        serverInfoRef.current.textContent = `Redirecting in ${countdown}...`

        const interval = setInterval(() => {
          countdown -= 1
          serverInfoRef.current.textContent = `Redirecting in ${countdown}...`

          if (countdown === 0) {
            clearInterval(interval)
            router.push(`/signin`)
          }
        }, 1000)
      }
    } catch (error) {
      submitBtnRef.current.textContent = "Submit"
      submitBtnRef.current.disabled = false
      serverInfoRef.current.textContent = `${error.message}`
      console.error("Error while creating post:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-32">
      <label htmlFor="userName" className="f-label">
        Name or pseudo
      </label>
      <input
        type="text"
        name="userName"
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

      <button ref={submitBtnRef} className="f-auth-submit">
        Submit
      </button>
      <p ref={serverInfoRef} className="text-center mb-10 hidden"></p>
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
