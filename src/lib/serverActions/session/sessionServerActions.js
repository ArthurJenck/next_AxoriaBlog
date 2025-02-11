"use server"
import { connectToDb } from "@/lib/utils/db/connectToDb"
import slugify from "slugify"
import bcrypt from "bcryptjs"
import { User } from "@/lib/models/user"
import { cookies } from "next/headers"
import { Session } from "@/lib/models/session"

export const register = async (formData) => {
  const { userName, email, password, confirmPassword } =
    Object.fromEntries(formData)

  if (userName.length < 3) {
    throw new Error("Username is too short")
  }
  if (password.length < 6) {
    throw new Error("Password is too short")
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match")
  }

  try {
    connectToDb()

    const user = await User.findOne({ userName })
    if (user) {
      throw new Error("Username already exists")
    }

    const normalizedUserName = slugify(userName, { lower: true, strict: true })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      userName,
      normalizedUserName,
      email,
      password: hashedPassword
    })

    await newUser.save()

    console.log("User saved to db")

    return { success: true }
  } catch (error) {
    console.error("Error while registering user", error)
    throw new Error(error.message || "An error occured while registering user")
  }
}

export const login = async (formData) => {
  const userName = formData.get("userName")
  const password = formData.get("password")

  try {
    await connectToDb()

    const user = await User.findOne({ userName })
    if (!user) {
      throw new Error("Invalid credentials")
    }

    const passwordIsValid = await bcrypt.compare(password, user.password)
    if (!passwordIsValid) {
      throw new Error("Invalid credentials")
    }

    const existingSession = await Session.findOne({
      userId: user._id,
      // $gt = greater than
      expiresAt: { $gt: new Date() }
    })
    if (existingSession) return { success: true }

    const session = new Session({
      userId: user._id,
      // 7 jours * 24 heures * 60 minutes * 60 secondes * 1000 millisecondes
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    await session.save()

    const cookieStore = cookies()
    cookieStore.set("sessionId", session._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // Ici c'est en secondes, pas en millisecondes
      maxAge: 7 * 24 * 60 * 60,
      // Propriété pour éviter cyberattaques CSRF
      sameSite: "Lax"
    })

    return { success: true }
  } catch (error) {
    console.error("Error while logging user in", error)
    throw new Error(error.message || "An error occured while logging user in")
  }
}
