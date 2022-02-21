import { useBody, useQuery } from 'h3'
import Model from '~/server/models/variant'
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
        .populate('gallery', { path: 1, mimetype: 1 })
        .populate('attrTerms', { name: 1, slug: 1 })
        // .populate('product', { name: 1, slug: 1 })
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
      // const body = await useBody(req)
      const doc = await Model.findByIdAndDelete(params.id)
      if (!doc) {
        const newError = new Error(`We can't find a document with ID = ${params.id}`)
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
