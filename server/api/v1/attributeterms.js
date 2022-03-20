import { useBody, useQuery } from 'h3'
import Model from '~/server/models/attributeterm'
import errorHandler from '~/server/utils/errorHandler'
import ApiFeatures from '~/server/utils/ApiFeatures'
import { deleteDocuments } from '~/server/controllers/factory'

export default async (req, res) => {
  res.statusCode = 200
  const params = useQuery(req)
  console.log('PARAM', params)

  if (req.method === 'GET') {
    let features
    try {
      const allDocs = await Model.find()
      features = new ApiFeatures(Model.find(), params).filter().fields().search().sort()
      const featured = await features.query
      features = new ApiFeatures(Model.find(), params).filter().fields().search().sort().paginate()
      const docs = await features.query.populate('parent', { name: 1, slug: 1 })
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
      // console.log(error)
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
    const response = await deleteDocuments(Model, params, 'Attributeterm')
    console.log('SRES', response)
    res.statusCode = response.statusCode
    if (res.statusCode === 200) return response.data
    else res.end(response.data)

    // let deletedCount = null
    // try {
    //   if (params.id) {
    //     deletedCount = await Model.findByIdAndDelete(params.id)
    //     if (!deletedCount) {
    //       const newError = new Error(`Unknown error while deleting document with ID = ${params.id} from Model ${Model}`)
    //       newError.customError = true
    //       newError.statusCode = 404
    //       throw newError
    //     }
    //   } else {
    //     const body = await useBody(req)
    //     deletedCount = await Model.deleteMany(params)
    //     if (!deletedCount) {
    //       const newError = new Error(
    //         `Unknown error while deleting many documents with condition ${JSON.stringify({
    //           customer: body.customer._id,
    //         })} from Model ${Model}`
    //       )
    //       newError.customError = true
    //       newError.statusCode = 404
    //       throw newError
    //     }
    //   }
    //   return deletedCount
    // } catch (error) {
    //   // console.log(error)
    //   const err = errorHandler(error)
    //   res.statusCode = err.statusCode
    //   return err.message
    // }
  }
}
