import { useBody, useQuery } from 'h3'
import Model from '~/server/models/category'
import errorHandler from '~/server/utils/errorHandler'
import ApiFeatures from '~/server/utils/ApiFeatures'

export default async (req, res) => {
  res.statusCode = 200
  const params = useQuery(req)

  if (req.method === 'GET') {
    let features
    try {
      const allDocs = await Model.find()
      features = new ApiFeatures(Model.find(), params).filter().fields().search().sort()
      const featured = await features.query
      features = new ApiFeatures(Model.find(), params).filter().fields().search().sort().paginate()
      const docs = await features.query
        .populate('parent', { name: 1, slug: 1 })
        .populate('gallery', { path: 1, mimetype: 1 })
      return { docs, count: featured.length, totalCount: allDocs.length }
    } catch (error) {
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await useBody(req)
      const doc = await Model.create(body)
      if (!doc) {
        const newError = new Error(`We are not able to create a new document`)
        newError.customError = true
        newError.statusCode = 404
        throw newError
      }
      return doc
    } catch (error) {
      console.log(error)
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  if (req.method === 'PATCH') {
    try {
      const body = await useBody(req)
      const doc = await Model.findByIdAndUpdate(params.id, body, {
        new: true,
        runValidators: true,
      })
      if (!doc) {
        const newError = new Error(`We can't find a document with ID = ${params.id}`)
        newError.customError = true
        newError.statusCode = 404
        throw newError
      }
      return doc
    } catch (error) {
      console.log(error)
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  if (req.method === 'DELETE') {
    try {
      const body = await useBody(req)
      const doc = await Model.findByIdAndDelete(body.id)
      if (!doc) {
        const newError = new Error(`We can't find a document with ID = ${body.id}`)
        newError.customError = true
        newError.statusCode = 404
        throw newError
      }
      return null
    } catch (error) {
      console.log(error)
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }
}

// import { useBody, useQuery } from 'h3'
// import { getDoc, createDoc, deleteDoc, updateDoc } from '~/server/controllers/factory'
// import ApiFeatures from '~/server/utils/ApiFeatures'

// import Category from '~/server/models/category'
// import errorHandler from '~/server/utils/errorHandler'

// export default async (req, res) => {
//   res.statusCode = 200

//   console.log('EEEEEEEEEEEEEEEEE', Error)
//   // try {
//   const params = await useQuery(req)
//   const id = req.url.split('/')[1]
//   console.log('ID', id)
//   console.log('RM', req.method)

//   // // Get all categories
//   if (req.method === 'GET' && !id) {
//     let features = new ApiFeatures(Category.find(), params).filter().fields().search().sort().paginate()
//     const docs = await features.query.populate('gallery', { name: 1, path: 1 }).populate('parent', { name: 1 })
//     return docs
//   }

//   if (req.method === 'POST') {
//     const body = await useBody(req)
//     // console.log(body)
//     const doc = await createDoc(Category, body)
//     // console.log(doc)
//     return doc
//   }

//   // Get category by ID
//   if (req.method === 'GET' && id) {
//     try {
//       const doc = await Category.findById(id).select('name').populate('gallery', { path: 1 })
//       if (!doc) {
//         const newError = new Error(`We cannot find any documents with this ID = ${id}`)
//         newError.customError = true
//         newError.statusCode = 400
//         throw newError
//       }
//       return doc
//     } catch (error) {
//       return errorHandler(error)
//     }
//   }
// }
