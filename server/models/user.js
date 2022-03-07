import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import Media from '~/server/models/media'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 50 characters long'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, 'Email is required'],
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address',
      ],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [20, 'Name cannot be more than 20 characters long'],
    },
    shippingAddresses: [
      {
        title: '',
        name: { type: String, default: '' },
        address: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        postalCode: { type: String, default: '' },
        country: { type: String, default: '' },
        default: { type: Boolean, default: false },
        addressType: {
          type: String,
          enum: ['Residential', 'Commercial'],
          default: 'Residential',
        },
      },
    ],

    billingAddress: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },

    phones: [{ phoneType: String, phoneNumber: String, phoneCountryCode: String }],

    avatar: { type: mongoose.Schema.Types.ObjectId, ref: Media },
    role: {
      type: String,
      enum: ['admin', 'shop-manager', 'customer', 'user'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Pasword is required'],
      minlength: [8, 'Password must contain at least 8 charcaters'],
      select: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    deliveryInstructions: {
      type: String,
      maxlength: [2000, '2000 characters maximum'],
    },
    // cart: {
    // 	type: Array,
    // 	default: [],
    // },
    // wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // confirmPassword: {
    //   type: String,
    //   required: [true, 'Confirmation Pasword is required'],
    //   validate: {
    //     // Only works on save()/create()
    //     validator: function (val) {
    //       return val === this.password
    //     },
    //     message: 'Passwords dont match',
    //   },
    // },
    passwordResetToken: String,
    passwordResetExpire: Date,
    passwordChangeDate: Date,
    // createdDate: {
    //   type: Date,
    //   default: Date.now(),
    // },
  },
  {
    timestamps: true,
  }
)

// Document Middleware, runs before save() and create()
schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  // this.confirmPassword = undefined
  next()
})

schema.methods.getSinedJwtToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

schema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

schema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.passwordResetExpire = Date.now() + 60 * 60 * 1000
  return resetToken
}

schema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next()
  this.passwordChangeDate = Date.now() - 1000
  next()
})

schema.methods.hasPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangeDate) {
    return parseInt(this.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp
  }
  return false
}

export default mongoose.model('User', schema)
