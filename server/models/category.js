import mongoose from 'mongoose'
import Media from '~/server/models/media'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Category Name is required'],
      minlength: [3, 'Name too short'],
      maxlength: [100, 'Name too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Category Slug is required'],
      minlength: [3, 'Slug too short'],
      maxlength: [100, 'Slug too long'],
    },
    permalink: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Category Permalink is required'],
      minlength: [3, 'Permalink too short'],
      maxlength: [100, 'Permalink too long'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot be more than 2000 characters long'],
    },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: Media }],
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Category', schema)
