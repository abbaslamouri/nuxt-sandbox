import fs from 'fs'
import path from 'path'
// import slugify from 'slugify'
import ApiFeatures from '~/server/utils/ApiFeatures'
import AppError from '~/server//utils/AppError'
import asyncHandler from '~/server/utils/asyncHandler'
import errorHandler from '../utils/errorHandler'
// import { features } from 'process'

const getAllDocs = async (Model, params) => {
  let features = new ApiFeatures(Model.find(), params).filter().fields().search().sort().paginate()
  let docs = []
  if (params.populate) {
    console.log(params.populate)
    const populateOptions = `${params.populate.split(',').join(' ')}`
    docs = await features.query.populate(populateOptions)
  } else {
    docs = await features.query
  }
  return docs
}

const createDoc = async (Model, body) => {
  try {
    const doc = await Model.create(body)
    // if (!doc) return new AppError(`We are not able to create a new document`, 404)
    return doc
  } catch (error) {
    return errorHandler(error)
  }
}

const getDoc = async (Model) => {
  let query = Model.findById(req.params.id)
  if (req.query.populate) {
    const populateOptions = `${req.query.populate.split(',').join(' ')}`
    query.populate(populateOptions)
  }
  const doc = await query
  if (!doc) return next(new AppError(`We can't find a document with ID = ${req.params.id}`, 404))
  return doc
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
