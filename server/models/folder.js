import mongoose from 'mongoose'
// import slugify from 'slugify'

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
      // required: [true, 'Folder Slug is required'],
    },
    // path: {
    //   type: String,
    //   unique: true,
    //   // required: [true, 'Folder Name is required'],
    //   maxlength: [500, 'Name cannot be more than 100 characters long'],
    //   // default: () => `/${this.slug}`,
    // },
    // createdDate: {
    //   type: Date,
    //   default: Date.now(),
    // },
    // parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  },
  {
    timestamps: true,
  }
)

// Document Middleware, runs before save() and create()
// schema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true })
//   this.path = `/${this.slug}`
//   next()
// })

// // Document Middleware, runs before save() and create()
// schema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next()
//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
//   this.confirmPassword = undefined
//   next()
// })

// schema.methods.getSinedJwtToken = async function () {
//   return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
// }

// schema.methods.checkPassword = async function (password) {
//   return await bcrypt.compare(password, this.password)
// }

// schema.methods.createPasswordResetToken = async function () {
//   const resetToken = crypto.randomBytes(32).toString('hex')
//   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
//   this.passwordResetExpire = Date.now() + 10 * 60 * 1000
//   return resetToken
// }

// schema.pre('save', async function (next) {
//   if (!this.isModified('password') || this.isNew) return next()
//   this.passwordChangeDate = Date.now() - 1000
//   next()
// })

// schema.methods.hasPasswordChanged = async function (JWTTimestamp) {
//   if (this.passwordChangeDate) {
//     return parseInt(this.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp
//   }

//   return false
// }

export default mongoose.model('Folder', schema)
