import fs from 'fs'
import slugify from 'slugify'
import ApiFeatures from '~/server/utils/ApiFeatures'
import asyncHandler from '~/server/utils/asyncHandler'
import AppError from '~/server/utils/AppError'
import Product from '~/server/models/product'

// const fetchAll = asyncHandler(async (req, res, next) => {
// 	// return next(new AppError(`We can't find a document with ID`, 404))
// 	const features = new ApiFeatures(
// 		Product.find().populate('category').populate('featuredImage').populate('gallery').populate('attributes'),
// 		req.query
// 	)
// 		.filter()
// 		.search()
// 		.sort()
// 		.fields()
// 		.paginate()

// 	const docs = await features.query
// 	res.status(200).json({
// 		status: 'succes',
// 		results: docs.length,
// 		docs,
// 	})
// })

// const uploadProducts = asyncHandler(async (req, res, next) => {
// 	console.log('RB', req.body)
// 	const products = JSON.parse(fs.readFileSync(`dev-data/products.json`, 'utf-8'))
// 	const docs = await Product.create(products)
// 	if (!docs) return next(new AppError(`We are not able to create products`, 404))
// 	res.status(201).json({
// 		status: 'success',
// 		results: docs.length,
// 		docs,
// 	})
// })

// const fetchBySlug = asyncHandler(async (req, res, next) => {
// 	let query = Product.find({ slug: req.params.slug })
// 	// if (populateOptions) query.populate(populateOptions)
// 	const doc = await query
// 	if (!doc) return next(new AppError(`We can't find a document with slug = ${req.params.slug}`, 404))
// 	res.status(200).json(doc)
// })

// const deleteProducts = asyncHandler(async (req, res, next) => {
// 	const docs = await Product.deleteMany()
// 	if (!docs) return next(new AppError(`We are not able to delete products`, 404))
// 	res.status(204).json({
// 		status: 'success',
// 		data: null,
// 	})
// })

// const preSave = asyncHandler(async (req, res, next) => {
// 	console.log('RBS', req.body)
// 	// req.body.slug = slugify(req.body.name, { lower: true })
// 	req.body.createdBy = req.user._id
// 	console.log('RBRBRB', req.body)
// 	next()
// })

// const setRating = asyncHandler(async (req, res, next) => {
//   console.log('Ratinf', req.body)
//   console.log('Ratinf', req.params)
//   req.body.slug = slugify(req.body.name, { lower: true })
//   req.body.createdBy = req.user._id
//   console.log('RBRBRB', req.body)
//   next()
// })

// const setRating = asyncHandler(async (req, res, next) => {
// 	console.log('Body', req.body)
// 	console.log('Params', req.params)
// 	console.log('user', req.user)

// 	const doc = await Product.findById(req.params.id).populate('featuredImage').populate('category').populate('gallery')
// 	if (!doc) return next(new AppError(`We are not able to find a product with this ID=${req.params.id}`, 404))
// 	const newRating = { rating: req.body.rating, postedBy: req.user.id }
// 	const index = doc.ratings.findIndex((el) => el.postedBy == req.user.id)
// 	console.log('IIIIIII', index)
// 	if (index == -1) {
// 		doc.ratings.push(newRating)
// 	} else {
// 		doc.ratings.splice(index, 1, newRating)
// 		console.log('KKKKKKKKKKKK', doc)
// 	}
// 	await doc.save()
// 	res.status(200).json({
// 		status: 'success',
// 		// doc: Product.findById().populate('featuredImage').populate('category').populate('gallery'),
// 		doc,
// 		// newRating,
// 		// averageRating: doc.averageRating,
// 	})
// })

// export { uploadProducts, deleteProducts, preSave, setRating, fetchBySlug }
export {}
