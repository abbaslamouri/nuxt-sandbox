import crypto from 'crypto'
import Email from '~/server/utils/Email'
import { useBody, useQuery, setCookie } from 'h3'
import config from '#config'

// import { getDoc, createDoc, deleteDoc, updateDoc } from '~/server/controllers/factory'
// import { login } from '~/server/controllers/auth'
// import ApiFeatures from '~/server/utils/ApiFeatures'

import User from '~/server/models/user'
import errorHandler from '~/server/utils/errorHandler'

export default async (req, res) => {
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
    } catch (error) {
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }

    try {
      const token = await user.createPasswordResetToken()
      const url = `${config.BASE_URL}/signup-complete?token=${token}`
      await user.save()
      user.password = undefined
      await new Email(user, url).sendCompleteRegistration()
      // res.statusCode = 200
      return {
        // ...(await sendTokenResponse(res, user)),
        status: 'success',
        message: `Email sent to ${user.email}.  Please follow the link in your email to complete your registration`,
      }
    } catch (err) {
      console.log(err)
      user.passwordResetToken = undefined
      user.passwordResetExpire = undefined
      await user.save({ validateBeforeSave: false })
      res.statusCode = 500
      return 'Email coulnd not be sent, please try agian later'
    }
  }

  // @desc      signup-complete
  // @route     POST /api/v1/auth/signup-complete
  // @access    Public
  if (req.method === 'PATCH' && urlPath[1] === 'signup-complete') {
    try {
      const body = await useBody(req)
      console.log(body)
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
      user.password = undefined

      const url = `${config.BASE_URL}`
      await new Email(user, url).sendWelcome()
      // res.statusCode = 200
      return {
        ...(await sendTokenResponse(res, user)),
        status: 'success',
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
      const user = await User.findOne({ email }).select('+password').populate({ path: 'avatar' })
      if (!user || !(await user.checkPassword(password))) {
        user.password = undefined
        const newError = new Error(`Invalid email and/or password`)
        newError.customError = true
        newError.statusCode = 401
        throw newError
      }
      // res.statusCode = 200
      return await sendTokenResponse(res, user)
    } catch (error) {
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

// const id = req.url.split('/')[1]
// console.log('ID', id)
// console.log('RM', req.method)

// // // Get all categories
// if (req.method === 'GET' && !id) {
// 	let features = new ApiFeatures(Category.find(), params).filter().fields().search().sort().paginate()
// 	const docs = await features.query.populate('gallery', { name: 1, path: 1 }).populate('parent', { name: 1 })
// 	return docs
// }

// if (req.method === 'POST') {
// 	const body = await useBody(req)
// 	// console.log(body)
// 	const doc = await createDoc(Category, body)
// 	// console.log(doc)
// 	return doc
// }

// // Get category by ID
// if (req.method === 'GET' && id) {
// 	try {
// 		const doc = await Category.findById(id).select('name').populate('gallery', { path: 1 })
// 		if (!doc) {
// 			const newError = new Error(`We cannot find any documents with this ID = ${id}`)
// 			newError.customError = true
// 			newError.statusCode = 400
// 			throw newError
// 		}
// 		return doc
// 	} catch (error) {
// 		return errorHandler(error)
// 	}
// }

// import express from 'express';
// import errorHandler from '~/server/utils/errorHandler';
// import {
//   register,
//   completeRegistration,
//   login,
//   protect,
//   getCurrentUser,
//   logout,
//   forgotPassword,
//   resetPassword,
//   updateCurrentUserInfo,
//   updateCurrentUserPassword,
//   // uploadUserAvatar,
//   // resizeAvatar,
//   authorize,
// } from '~/server/controllers/auth';

// const router = express.Router();

// router.route('/register').post(register);
// router.route('/complete-registration/:token').patch(completeRegistration);
// router.route('/login').post(login);
// router.route('/logout').get(logout);
// router.route('/forgotpassword').post(forgotPassword);
// router.route('/resetpassword/:resetToken').patch(resetPassword);

// router.use(protect);

// router.route('/update-current-user').patch(updateCurrentUserInfo);
// router.route('/update-current-user-password').patch(updateCurrentUserPassword);
// router.route('/current-user').get(getCurrentUser);

// router.use(authorize('admin'));

// router.route('/').get(getAllUsers).post(createUser)
// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

// router.use(errorHandler);

// export default router;

// router.route('/signup').post(signup)
// router.route('/login').post(login)
// router.route('/logout').get(logout)
// router.route('/forgot-password').post(forgotPassword)
// router.route('/reset-password/:token').patch(resetPassword)

// router.use(checkAuth)

// router.route('/update-my-password').patch(updateMyPassword)

// router.route('/get-me').get(getMe, getUser)
// router.route('/update-me').patch(uploadUserPhoto, updateMe)
// router.route('/delete-me').delete(deleteMe)

// router.use(restrictTo('admin'))

// router.route('/').get(getAllUsers).post(createUser)
// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)
