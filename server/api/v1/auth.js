import { useBody, useQuery, setCookie } from 'h3'
// import { getDoc, createDoc, deleteDoc, updateDoc } from '~/server/controllers/factory'
// import { login } from '~/server/controllers/auth'
// import ApiFeatures from '~/server/utils/ApiFeatures'

import User from '~/server/models/user'
import errorHandler from '~/server/utils/errorHandler'

export default async (req, res) => {
	const sendTokenResponse = async (user, res) => {
		const token = await user.getSinedJwtToken()
		const auth = { token, user: { name: user.name, email: user.email, role: user.role } }

		setCookie(res, 'auth', JSON.stringify(auth), {
			expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production' ? true : false,
		})
		return auth
	}

	try {
		let response = null
		res.statusCode = 200
		const params = await useQuery(req)
		const urlPath = req.url.split('/')

		if (req.method === 'POST' && urlPath[1] === 'login') {
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
			res.statusCode = 200
			return sendTokenResponse(user, res)

			// response = await login(await useBody(req))
			// if (response && response.status === 'error') {
			// 	console.log('PPPPP', response)
			// 	res.statusCode = response.statusCode
			// 	return response.message
			// } else {
			// 	return response
			// }
		}
	} catch (error) {
		const err = errorHandler(error)
		res.statusCode = err.statusCode
		return err.message
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
}

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
