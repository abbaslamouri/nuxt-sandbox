import crypto from 'crypto'
import Email from '~/server/utils/Email'
import { useBody, useQuery, setCookie } from 'h3'
import config from '#config'
import User from '~/server/models/user'
import Media from '~/server/models/media'
import errorHandler from '~/server/utils/errorHandler'
import ApiFeatures from '~/server/utils/ApiFeatures'
import multer from 'multer'
import sharp from 'sharp'
import slugify from 'slugify'
import formidable from 'formidable'
// import AppError from '~/server/utils/AppError'

const form = new formidable.IncomingForm()

export default async (req, res) => {
  console.log('here')
  const memoryStorage = multer.memoryStorage()
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.toLowerCase().split(' ').join('-'))
    },
  })

  function imageFilter(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true)
    } else {
      cb(new AppError('Only images are allowed', 403), false)
    }
  }

  const resizeImage = async (req, res, next) => {
    if (!req.file) return next()
    req.file.destination = 'public/uploads'
    req.file.filename = slugify(req.file.originalname, { lower: true })

    await sharp(req.file.buffer)
      // .resize(200, 200)
      // .toFormat('jpeg')
      // .jpeg({ quality: 80 })
      .toFile(`public/uploads/${req.file.filename}`)

    next()
  }

  function otherFileFilter(req, file, cb) {
    // console.log('FF', file)
    if (!file.originalname.match(/\.(pdf|PDF|xls|xlsx|video)$/))
      return cb(
        new AppError(
          `Only  pdf and excel files are allowed. You are not allwed to upload "${file.mimetype.split('/')[1]}" files`,
          403
        ),
        false
      )

    cb(null, true)
  }

  const imageUpload = multer({ storage: memoryStorage, fileFilter: imageFilter }).single('file')
  const otherFileUpload = multer({ storage: diskStorage, fileFilter: otherFileFilter }).single('file')

  const sendTokenResponse = async (res, user = null, expiresIn = null) => {
    let auth = null
    if (user) {
      const token = await user.getSinedJwtToken()
      auth = { token, user: { name: user.name, email: user.email, role: user.role } }
    }
    const expires = !expiresIn
      ? new Date(Date.now() + config.COOKIE_EXPIRE * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + expiresIn)

    setCookie(res, 'auth', JSON.stringify(auth), {
      expires,
      httpOnly: true,
      secure: config.NODE_ENV === 'production' ? true : false,
      path: '/',
    })
    return auth
  }

  res.statusCode = 200
  const urlPath = req.url.split('/')
  const params = await useQuery(req)

  console.log('UUUUUU', urlPath[1])
  console.log('Params', params)
  console.log(req.method)

  // @desc      signup
  // @route     POST /api/v1/media
  // @access    Public
  if (req.method === 'GET') {
    try {
      let features = new ApiFeatures(Media.find(), params).filter().fields().search().sort().paginate()
      const docs = await features.query.populate('folder', { name: 1, path: 1, slug: 1 })
      // console.log('DDDDDD', docs)
      return docs
    } catch (error) {
      // console.log(error)
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  // @desc      media
  // @route     POST /api/v1/media/image
  // @access    Public
  if (req.method === 'POST' && urlPath[1] === 'image') {
    try {
      // const body = await useBody(req)
      // console.log('Body', body)

      form.parse(req, (err, fields, files) => {
        const { data } = fields
        console.log('error', err)
        console.log('fields', fields)
        console.log('files', files)
      })
      // multer({ storage: memoryStorage, fileFilter: imageFilter }).single('file')
      // resizeImage()
      // console.log('RF', req.file)

      return 'body'
    } catch (error) {
      console.log(error)
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  // @desc      signup
  // @route     POST /api/v1/auth/signup
  // @access    Public
  if (req.method === 'POST' && urlPath[1] === 'signup') {
    let user = null
    try {
      const body = await useBody(req)
      user = await User.create({
        name: body.name,
        email: body.email,
        password: '@#ASgghgjjjjj&*LKKLKLKLKpppp',
      })
      if (!user) {
        const newError = new Error(`We are not able to create a new user at this time, please try again later`)
        newError.customError = true
        newError.statusCode = 400
        throw newError
      }
      const token = await user.createPasswordResetToken()
      const url = `${config.BASE_URL}/signup-complete?token=${token}`
      await user.save()
      await new Email(user, url).sendCompleteRegistration()
      return {
        message: `Email sent to ${user.email}.  Please follow the link in your email to complete your registration.  Please note that you have 1 hour to complete your registration`,
      }
    } catch (error) {
      // console.log(error)
      if (user) {
        user.passwordResetToken = undefined
        user.passwordResetExpire = undefined
        user.save({ validateBeforeSave: false })
      }
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  // @desc      signup-complete
  // @route     POST /api/v1/auth/signup-complete
  // @access    Public
  if (req.method === 'PATCH' && urlPath[1] === 'signup-complete') {
    try {
      const body = await useBody(req)
      const hashedToken = await crypto.createHash('sha256').update(body.token).digest('hex')
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpire: { $gt: Date.now() },
      })
      if (!user) {
        const newError = new Error(`Your registration token is invlaid or has expired`)
        newError.customError = true
        newError.statusCode = 400
        throw newError
      }
      if (user.email !== body.email.toLowerCase()) {
        const newError = new Error(`Invlaid email for this token`)
        newError.customError = true
        newError.statusCode = 400
        throw newError
      }
      user.password = body.password
      user.passwordResetToken = undefined
      user.passwordResetExpire = undefined
      await user.save()
      const url = `${config.BASE_URL}`
      await new Email(user, url).sendWelcome()
      return {
        message: `Registration succesful`,
      }
    } catch (error) {
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  // @desc      login
  // @route     POST /api/v1/auth/login
  // @access    Public
  if (req.method === 'POST' && urlPath[1] === 'login') {
    try {
      const body = await useBody(req)
      const { email, password } = body
      if (!email || !password) {
        const newError = new Error(`Email and Password are required`)
        newError.customError = true
        newError.statusCode = 401
        throw newError
      }
      const user = await User.findOne({ email }).select('+password').populate('avatar', { path: 1 })
      if (!user || !(await user.checkPassword(password))) {
        const newError = new Error(`Invalid email and/or password`)
        newError.customError = true
        newError.statusCode = 401
        throw newError
      }
      user.password = undefined

      return await sendTokenResponse(res, user)
    } catch (error) {
      // console.log(error)
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  // @desc      logout
  // @route     POST /api/v1/auth/logout
  // @access    Public
  if (urlPath[1] === 'logout') {
    try {
      // res.statusCode = 200
      await sendTokenResponse(res)
      return null
    } catch (error) {
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  // @desc      forgot-password
  // @route     POST /api/v1/auth/forgot-password
  // @access    Public
  if (req.method === 'POST' && urlPath[1] === 'forgot-password') {
    let user = null
    try {
      const { email } = await useBody(req)
      console.log(email)
      if (!email) {
        const newError = new Error(`Please enter a valid email`)
        newError.customError = true
        newError.statusCode = 404
        throw newError
      }
      user = await User.findOne({ email })
      if (!user) {
        const newError = new Error(`We cannot find user with this email in our database`)
        newError.customError = true
        newError.statusCode = 404
        throw newError
      }
      const resetToken = await user.createPasswordResetToken()
      const url = `${config.BASE_URL}/${resetToken}`
      await user.save({ validateBeforeSave: false })
      await new Email(user, url).sendPasswordReset()
      return {
        message: `Email sent to ${user.email}.  Please follow the link in your email to reset your pasword.  Please note that you have 1 hour to reset your password`,
      }
    } catch (error) {
      // console.log(error)
      if (user) {
        user.passwordResetToken = undefined
        user.passwordResetExpire = undefined
        user.save({ validateBeforeSave: false })
      }
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  // @desc      resetpassword
  // @route     POST /api/v1/auth/resetpassword
  // @access    Public
  if (req.method === 'PATCH' && urlPath[1] === 'resetpassword') {
    try {
      const { password, resetToken } = await useBody(req)
      const hashedToken = await crypto.createHash('sha256').update(resetToken).digest('hex')
      const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpire: { $gt: Date.now() } })
      if (!user) {
        const newError = new Error(`Token is invlaid or has expired`)
        newError.customError = true
        newError.statusCode = 400
        throw newError
      }
      user.password = password
      user.passwordResetToken = undefined
      user.passwordResetExpire = undefined
      await user.save()
      return {
        message: `password reset succesful`,
      }
    } catch (error) {
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  try {
    const newError = new Error(`No match found for location with path ${req.url}`)
    newError.customError = true
    newError.statusCode = 401
    throw newError
  } catch (error) {
    const err = errorHandler(error)
    res.statusCode = err.statusCode
    return err.message
  }
}

// import express from 'express'
// import errorHandler from '~/server/utils/errorHandler'
// import { imageUpload, otherFileUpload, resizeImage } from '~/server/controllers/media'

// import { getAllDocs, getDoc, getDocsCount, deleteMedia, updateDoc, createMedia } from '~/server/controllers/factory'
// import Media from '~/server/models/media'

// const router = express.Router()

// router.route('/').get(getAllDocs(Media))
// router.route('/count').get(getDocsCount(Media))
// router.route('/:id').get(getDoc(Media))

// router.route('/:id').patch(updateDoc(Media))
// router.route('/:id').delete(deleteMedia(Media))
// router.route('/image').post(imageUpload, resizeImage, createMedia(Media))
// router.route('/').post(otherFileUpload, createMedia(Media))

// router.use(errorHandler)

// export default router
