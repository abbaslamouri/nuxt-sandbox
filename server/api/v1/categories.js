import { useBody, useQuery } from 'h3'
import { getDoc, createDoc, deleteDoc, updateDoc } from '~/server/controllers/factory'
import ApiFeatures from '~/server/utils/ApiFeatures'

import Category from '~/server/models/category'
import errorHandler from '~/server/utils/errorHandler'

export default async (req, res) => {
  res.statusCode = 200

  console.log('EEEEEEEEEEEEEEEEE', Error)
  // try {
  const params = await useQuery(req)
  const id = req.url.split('/')[1]
  console.log('ID', id)
  console.log('RM', req.method)

  // // Get all categories
  if (req.method === 'GET' && !id) {
    let features = new ApiFeatures(Category.find(), params).filter().fields().search().sort().paginate()
    const docs = await features.query.populate('gallery', { name: 1, path: 1 }).populate('parent', { name: 1 })
    return docs
  }

  if (req.method === 'POST') {
    const body = await useBody(req)
    // console.log(body)
    const doc = await createDoc(Category, body)
    // console.log(doc)
    return doc
  }

  // Get category by ID
  if (req.method === 'GET' && id) {
    try {
      const doc = await Category.findById(id).select('name').populate('gallery', { path: 1 })
      if (!doc) {
        const newError = new Error(`We cannot find any documents with this ID = ${id}`)
        newError.customError = true
        newError.statusCode = 400
        throw newError
      }
      return doc
    } catch (error) {
      return errorHandler(error)
    }
  }
}
