import multer from 'multer'
import sharp from 'sharp'
import slugify from 'slugify'
import AppError from '~/server/utils/AppError'

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

export { imageUpload, otherFileUpload, resizeImage }
