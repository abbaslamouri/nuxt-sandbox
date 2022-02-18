import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Folder Name is required'],
      maxlength: [100, 'Name cannot be more than 100 characters long'],
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Folder', schema)
