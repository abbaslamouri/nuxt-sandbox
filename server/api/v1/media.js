import { useBody, useQuery } from 'h3'
import Media from '~/server/models/media'
import errorHandler from '~/server/utils/errorHandler'
import ApiFeatures from '~/server/utils/ApiFeatures'

export default async (req, res) => {
  res.statusCode = 200
  const params = useQuery(req)

  if (req.method === 'GET') {
    let features
    try {
      features = new ApiFeatures(Media.find(), params).filter().fields().search().sort()
      const allDocs = await features.query
      const count = allDocs.length
      features = new ApiFeatures(Media.find(), params).filter().fields().search().sort().paginate()
      const docs = await features.query.populate('folder', { name: 1, path: 1, slug: 1 })
      return { docs, count }
    } catch (error) {
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await useBody(req)
      const doc = await Media.create(body)
      if (!doc) {
        const newError = new Error(`We are not able to create a new document`)
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

  if (req.method === 'PATCH') {
    try {
      const body = await useBody(req)
      const doc = await Media.findByIdAndUpdate(params.id, body, {
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
      const body = await useBody(req)
      const doc = await Media.findByIdAndDelete(body.id)
      if (!doc) {
        const newError = new Error(`We can't find a document with ID = ${body.id}`)
        newError.customError = true
        newError.statusCode = 404
        throw newError
      }
      return null
    } catch (error) {
      // console.log(error)
      const err = errorHandler(error)
      res.statusCode = err.statusCode
      return err.message
    }
  }
}
