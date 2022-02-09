import asyncHandler from '~/server/utils/asyncHandler'
import AppError from '~/server/utils/AppError'
import User from '~/server/models/user'

const getAll = asyncHandler(async (req, res, next) => {
	const docs = await User.find()
	res.status(200).json({
		status: 'succes',
		results: docs.length,
		users: docs,
	})
})

export { getAll }
