import fs from 'fs'
import path from 'path'
// import slugify from 'slugify'
import ApiFeatures from '~/server/utils/ApiFeatures'
import AppError from '~/server//utils/AppError'
import asyncHandler from '~/server/utils/asyncHandler'
// import { features } from 'process'

const getAllDocs = (Model) => {
  // asyncHandler(async (req, res) => {
  // return next(new AppError(`We can't find a document with ID`, 404))

  // console.log('=======', req.query)

  // return next(new AppError(`We can't find a document with ID`, 404))
  // let features
  let features = new ApiFeatures(Model.find(), req.query).fields().filter().search().sort().paginate()
  // if (req.query.populate) {
  // 	features.populate(populateOptions)
  // }
  // else {
  //   features = new ApiFeatures(Model.find(), req.query).filter().search().sort().fields().paginate()
  // }
  let docs = []
  if (req.query.populate) {
    // let newPopulate = null
    // console.log('QS', req.query.populate)

    // // const popArray = req.query.populate.split(',')
    // if (req.query.populate.includes('thumbImage')) {
    //   newPopulate = req.query.populate.replace(' thumbImage ', ' ')
    //   features.query.populate('thumbImage', { path: 1 })
    // }
    // if (req.query.populate.includes('recipeImage')) {
    //   newPopulate = newPopulate.replace(' recipeImage ', ' ')
    //   features.query.populate('recipeImage', { path: 1 })
    // }
    // // console.log('PPPPRRRR', popArray)
    const populateOptions = `${req.query.populate.split(',').join(' ')}`
    docs = await features.query.populate(populateOptions)
  } else {
    docs = await features.query
  }
  // const count = await Model.count({})
  // res.status(200).json({
  // 	status: 'succes',
  // 	results: docs.length,
  // 	count,
  // 	docs,
  // })
  return docs
  // res.status(200).json(docs)
}

const getDocsCount = (Model) =>
  asyncHandler(async (req, res, next) => {
    let features = new ApiFeatures(Model.find(), req.query).filter().search()
    const docs = await features.query
    res.status(200).json(docs.length)
  })

const deleteDoc = (Model) =>
  asyncHandler(async (req, res, next) => {
    // console.log('RPID', req.params);
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) return next(new AppError(`We can't find a document with ID = ${req.params.id}`, 404))
    res.status(204).json(null)
  })

const deleteManyDocs = (Model) =>
  asyncHandler(async (req, res, next) => {
    // console.log('herexxxxxxx');
    const doc = await Model.deleteMany(req.body)
    // console.log(doc);
    if (!doc) return next(new AppError(`Unable to delete document}`, 404))
    res.status(204).json(null)
  })

const deleteMedia = (Model) =>
  asyncHandler(async (req, res, next) => {
    // return next(new AppError(`We can't find a document with `, 404))
    // console.log('RP', req.params);
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) return next(new AppError(`We can't find a document with ID = ${req.params.id}`, 404))
    var filePath = path.resolve(path.dirname(doc.filename))
    await fs.promises.unlink(`${filePath}/public/uploads/${doc.filename}`)
    res.status(204).json({
      status: 'success',
      data: null,
    })
  })

const createDoc = (Model) =>
  asyncHandler(async (req, res, next) => {
    // console.log('RRRRRRBBBBBB', req.body)
    // return next(new AppError(`We are not able to create a new document`, 404))
    // console.log('Body', req.body)
    // console.log('File', req.file)
    const doc = await Model.create(req.body)
    if (!doc) return next(new AppError(`We are not able to create a new document`, 404))
    res.status(201).json(doc)
  })

const updateDoc = (Model) =>
  asyncHandler(async (req, res, next) => {
    // console.log('XCXCXCXCXXC', req.body);
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!doc) return next(new AppError(`We can't find a document with ID = ${req.params.id}`, 404))
    res.status(200).json(doc)
  })

const createMedia = (Model) =>
  asyncHandler(async (req, res, next) => {
    // console.log('RF', req.file);
    // return res.status(201).json({ xx: 'PPPPPP' })
    const fileDestination = req.file.destination.split('/')
    fileDestination.shift()
    const filePath = fileDestination.join('/')
    // let originalname = req.file.originalname
    // if (req.file.mimetype.includes('pdf')) originalname = path.basename(req.file.originalname, '.pdf')
    const doc = await Model.create({
      name: req.file.originalname,
      filename: req.file.filename,
      slug: req.file.filename,
      path: `/${filePath}/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      folder: req.body.folder,
      url: `${req.protocol}/${req.get('host')}/uploads/${req.file.filename}`,
    })
    if (!doc) return next(new AppError(`We are not able to create a new document`, 404))
    res.status(201).json(doc)
  })

const getDoc = (Model) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (req.query.populate) {
      const populateOptions = `${req.query.populate.split(',').join(' ')}`
      query.populate(populateOptions)
    }
    const doc = await query
    if (!doc) return next(new AppError(`We can't find a document with ID = ${req.params.id}`, 404))
    res.status(200).json(doc)
  })

const searchDb = (Model) =>
  asyncHandler(async (req, res) => {
    // console.log('=======', JSON.stringify(req.query));

    const regex = new RegExp(req.query.keyword, 'i')
    const docs = await Model.find({ name: { $regex: regex } })
    res.status(200).json(docs)
  })

// const createSlug = asyncHandler(async (req, res, next) => {
//   console.log('RBS', req.body);
//   req.body.slug = slugify(req.body.name, { lower: true });
//   next();
// });

export {
  getAllDocs,
  deleteDoc,
  deleteManyDocs,
  deleteMedia,
  updateDoc,
  createDoc,
  createMedia,
  getDoc,
  getDocsCount,
  // createSlug,
  searchDb,
}
