import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import Email from '~/server/utils/Email'
import errorHandler from '~/server/utils/errorHandler'

import asyncHandler from '~/server/utils/asyncHandler'
import AppError from '~/server/utils/AppError'
import User from '~/server/models/user'

const sendTokenResponse = async (user, res, statusCode) => {
	const token = await user.getSinedJwtToken()
	const auth = { token, user: { name: user.name, email: user.email, role: user.role } }

	res.cookie('auth', JSON.stringify(auth), {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production' ? true : false,
	})

	res.status(statusCode).json(auth)
}

// @desc      Signup
// @route     POST /api/v1/auth/register
// @access    Public
const register = asyncHandler(async (req, res, next) => {
	// return next(new AppError('Email and Password are required', 401))
	// console.log('RB', req.body)
	const user = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: '@#ASgghgjjjjj&*LKKLKLKLKpppp',
	})
	const token = await user.createPasswordResetToken()
	const url = `${req.protocol}//:${req.get('host')}/auth/complete-registration?token=${token}`
	await user.save()
	user.password = undefined
	// console.log('YYYYYYYbbb', user)

	try {
		await new Email(user, url).sendCompleteRegistration()
		res.status(200).json({
			status: 'success',
			message: `Email sent to ${user.email}.  Please follow the link in your email to complete your registration`,
		})
	} catch (err) {
		console.log(err)
		user.passwordResetToken = undefined
		user.passwordResetExpire = undefined
		await user.save({ validateBeforeSave: false })
		return next(new AppError('Email coulnd not be sent, please try agian later', 500))
	}
})

// @desc      Signup
// @route     POST /api/v1/auth/register
// @access    Public
const completeRegistration = asyncHandler(async (req, res, next) => {
	// return next(new AppError('Email and Password are required', 401))
	// console.log('RB', req.body)
	// console.log('RR', req.params.token)
	const hashedToken = await crypto.createHash('sha256').update(req.params.token).digest('hex')
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpire: { $gt: Date.now() },
	})

	if (!user) return next(new AppError('Your registration token is invlaid or has expired', 400))
	if (user.email !== req.body.email.toLowerCase()) return next(new AppError('Invlaid email for this token', 400))
	user.password = req.body.password
	// user.confirmPassword = req.body.confirmPassword
	user.passwordResetToken = undefined
	user.passwordResetExpire = undefined
	await user.save()
	user.password = undefined

	const url = `${req.protocol}//:${req.get('host')}/shop`
	await new Email(user, url).sendWelcome()
	sendTokenResponse(user, res, 200)
	// const user = await User.create({
	//   name: req.body.name,
	//   email: req.body.email,
	//   password: req.body.password,
	//   confirmPassword: req.body.confirmPassword,
	// })
	// user.password = undefined
	// // const url = `${req.protocol}//:${req.get('host')}/shop`
	// const url = `https://abbaslamouri.com`
	// await new Email(user, url).sendWelcome()

	// sendTokenResponse(user, res, 200)
})

// @desc      Signup
// @route     POST /api/v1/auth/register
// @access    Public
const registerOld = asyncHandler(async (req, res, next) => {
	// return next(new AppError('Email and Password are required', 401))
	// console.log('RB', req.body)
	const user = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
	})
	user.password = undefined
	// const url = `${req.protocol}//:${req.get('host')}/shop`
	const url = `https://abbaslamouri.com`
	await new Email(user, url).sendWelcome()

	sendTokenResponse(user, res, 200)
})

// @route     POST /api/v1/auth/login
const login = async (body) => {
	try {
		const { email, password } = body
		if (email || password) {
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
		return user
	} catch (error) {
		return errorHandler(error)
	}
}

// @desc      Logout user and clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
const logout = asyncHandler(async (req, res, next) => {
	res.cookie('auth', null, {
		expires: new Date(Date.now() + 1000),
		httpOnly: true,
	})

	// res.cookie('user', null, {
	//   expires: new Date(Date.now() + 1000),
	//   httpOnly: true,
	// })

	// res.cookie('user-name', '', {
	//   expires: new Date(Date.now() + 1000),
	//   httpOnly: true,
	// })
	// res.cookie('user-avatar', '', {
	//   expires: new Date(Date.now() + 1000),
	//   httpOnly: true,
	// })

	res.status(200).json({
		status: 'success',
		data: null,
	})
})

// @desc      Send password reset email
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
const forgotPassword = asyncHandler(async (req, res, next) => {
	const { email } = req.body

	if (!email) return next(new AppError('Please enter a valid email', 404))

	const user = await User.findOne({ email })
	if (!user) return next(new AppError('We cannot find user with this email in our database', 404))

	const resetToken = await user.createPasswordResetToken()
	// const url = `${req.protocol}//:${req.get('host')}/auth/${resetToken}`
	const url = `https://abbaslamouri.com/${resetToken}`
	await user.save({ validateBeforeSave: false })

	// const resetUrl = `${req.protocol}//:${req.get('host')}/admin/auth/${resetToken}`
	// const text = `You are receiving this email because your or someone else requested a padssword reset.  Pleasec use the link below to reset your password. If you did not submit a request, please ignore this email.\n\n ${resetUrl}`
	// const html = `<p>You are receiving this email because your or someone else requested a padssword reset.  Pleasec click the link below to reset your password. If you did not submit a request, please ignore this email.</p> <strong><a href="${resetUrl}">Reset Password</a></strong>`

	try {
		await new Email(user, url).sendPasswordReset()

		// // await sendEmail({
		// //   to: user.email,
		// //   subject: 'Your password reset token (valid for 10 minutes)',
		// //   text,
		// //   html,
		// })
		res.status(200).json({
			status: 'success',
			message: 'Email sent',
		})
	} catch (err) {
		console.log(err)
		user.passwordResetToken = undefined
		user.passwordResetExpire = undefined
		await user.save({ validateBeforeSave: false })
		return next(new AppError('Email coulnd not be sent, please try agian later', 500))
	}
})

// @desc      Reset password
// @route     PATCH /api/v1/auth/resetpassword/resetToken
// @access    Public
const resetPassword = asyncHandler(async (req, res, next) => {
	const hashedToken = await crypto.createHash('sha256').update(req.params.resetToken).digest('hex')
	const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpire: { $gt: Date.now() } })
	if (!user) return next(new AppError('Token is invlaid or has expired', 400))
	user.password = req.body.password
	user.confirmPassword = req.body.confirmPassword
	user.passwordResetToken = undefined
	user.passwordResetExpire = undefined
	await user.save()
	sendTokenResponse(user, res, 200)
})

// @desc      Get current logged in user
// @route     POST /api/v1/auth/login
// @access    Public
const getCurrentUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id)
	if (!user) throw new AppError('You are not allowed to access these resources, please login', 401)
	res.status(200).json({
		status: 'success',
		user,
	})
})

// @desc      Update current logged in user info
// @route     PATCH /api/v1/auth/updateme
// @access    Public
const updateCurrentUserInfo = asyncHandler(async (req, res, next) => {
	if (req.body.password || req.body.confirmPassword)
		return next(new AppError('You cannot use this route to update your passsword', 400))
	const allowedFields = {
		name: req.body.name,
		email: req.body.email,
		avatar: req.body.avatar,
	}
	const user = await User.findByIdAndUpdate(req.user.id, allowedFields, { new: true, runValidators: true }).populate({
		path: 'avatar',
	})
	if (!user) return next(new AppError('You must be logged in to change your name, email or profile picture', 401))

	res.cookie('user', JSON.stringify(user), {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production' ? true : false,
	})

	res.status(200).json({
		status: 'success',
		user,
	})
})

// @desc      Update current logged in user password
// @route     PATCH /api/v1/auth/updateCurrentUserpassword
// @access    Public
const updateCurrentUserPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password')
	// console.log('USER', user)
	if (!user) return next(new AppError('You must be logged in to change your password', 401))
	if (!(await user.checkPassword(req.body.currentPassword))) return next(new AppError('Invalid current password', 401))
	user.password = req.body.password
	// user.confirmPassword = req.body.confirmPassword
	await user.save()
	user.password = undefined
	sendTokenResponse(user, res, 200)
})

// @desc      Protect middleware
// @access    Private
const protect = asyncHandler(async (req, res, next) => {
	// console.log('RC', req.cookies.auth)
	let token = ''
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1]
	} else if (req.cookies && req.cookies.auth) {
		token = JSON.parse(req.cookies.auth).token
	}

	if (!token) return next(new AppError('You are not allowed to access these resources, please login', 401))

	const decoded = await jwt.verify(token, process.env.JWT_SECRET)
	const user = await User.findById(decoded.id)
	if (!user) return next(new AppError('We cannot find a user with this token in our database', 401))

	if (await user.hasPasswordChanged(decoded.iat))
		return next(new AppError('User changed password recently, please login again', 401))

	req.user = user

	next()
})

// @desc      Grant access to specific roles
// @access    Private
const authorize = (...roles) => {
	// console.log('PPPPPPPPPPPPPP')
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			return next(new AppError('You do not have adequate permisson to perform this action', 403))
		next()
	}
}

// const isLoggedIn = async (req, res, next) => {
//   if (!req.cookies || !req.cookies.jwt) return next()

//   const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET)
//   const user = await User.findById(decoded.id)
//   if (!user) return next()

//   if (await user.hasPasswordChanged(decoded.iat)) return next()

//   res.locals.user = user

//   next()
// }

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/images/users')
//   },
//   filename: (req, file, cb) => {
//     const fileExt = file.mimetype.split('/')[1]
//     const fileName = `${req.user.id}-${Date.now()}`
//     // const fileName = `${file.originalname.split('.')[0]}-${req.user.id}-${Date.now()}`
//     cb(null, `${fileName}.${fileExt}`)
//   },
// })

// const multerStorage = multer.memoryStorage()

// function multerFilter(req, file, cb) {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true)
//   } else {
//     cb(new AppError('Only images are allowed', 403), false)
//   }
// }

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

// const uploadUserAvatar = upload.single('avatar')

// const resizeAvatar = async (req, res, next) => {
//   if (!req.file) return next()
//   req.file.fileName = `${req.user.id}-${Date.now()}.${req.file.mimetype.split('/')[1]}`
//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     // .toFormat('jpeg')
//     .jpeg({ quality: 80 })
//     .toFile(`public/images/users/${req.file.fileName}`)

//   next()
// }

export {
	register,
	completeRegistration,
	login,
	protect,
	getCurrentUser,
	authorize,
	logout,
	forgotPassword,
	resetPassword,
	updateCurrentUserInfo,
	updateCurrentUserPassword,
	// uploadUserAvatar,
	// resizeAvatar,
}
