import { connectToDb } from "@/lib/utils/db/connectToDb"
import slugify from "slugify"

export const registe = async (formData) => {
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
