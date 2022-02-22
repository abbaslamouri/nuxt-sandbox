import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Attribute Name is required'],
      minlength: [3, 'Too short'],
      maxlength: [100, 'Attribute Name cannot be more than 100 characters long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    // variation: {
    //   type: Boolean,
    //   default: false,
    // },
    // active: {
    //   type: Boolean,
    //   default: false,
    // },
  },

  {
    timestamps: true,
  }
)

export default mongoose.model('Attribute', schema)
