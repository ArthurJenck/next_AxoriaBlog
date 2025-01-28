const { default: mongoose } = require("mongoose")

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  slug: {
    type: String,
    unique: true
  }
})

export const Tag = mongoose.models?.Tag || mongoose.model("Tag", tagSchema)
