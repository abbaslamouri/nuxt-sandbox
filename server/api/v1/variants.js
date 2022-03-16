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
        // .populate('attrTerms', { name: 1, slug: 1, parent: 1 })
        .populate({
          path: 'attrTerms',
          model: 'Attributeterm',
          populate: {
            path: 'parent',
            model: 'Attribute',
          },
        })
      // .populate('attrTerms.parent', { name: 1, slug: 1 })
      // .populate('product', { name: 1, slug: 1 })
      return { docs, count: featured.length, totalCount: allDocs.length }
    } catch (error) {
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  // if (req.method === 'POST' && req.url.includes('/delete-many')) {
  // console.log('VVVVVV', params.id)
  // const docs = await Model.deleteMany({ product: params.productId })
  // console.log('VVVVVDDDDDD', docs)
  // return docs
  // }

  if (req.method === 'POST') {
    try {
      const body = await useBody(req)
      console.log('BBBBBBB', body)
      console.log('BD', Array.isArray(body))
      let result = null
      if (Array.isArray(body)) result = await Model.insertMany(body)
      else result = await Model.create(body)
      if (!result) {
        const newError = new Error(`We are not able to create a new document`)
        newError.customError = true
        newError.statusCode = 404
        throw newError
      }
      return result
    } catch (error) {
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
      // console.log(error)
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  if (req.method === 'DELETE') {
    try {
      console.log('PR', params)
      let result = null
      if (params.id) result = await Model.findByIdAndDelete(params.id)
      else result = await Model.deleteMany(params)
      if (!result) {
        const newError = new Error(`We can't find a document with ID = ${params.id}`)
        newError.customError = true
        newError.statusCode = 404
        throw newError
      }
      return result
    } catch (error) {
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }
}
