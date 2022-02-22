import { useBody, useQuery, useCookies } from 'h3'
import jwt from 'jsonwebtoken'

import Model from '~/server/models/product'
import User from '~/server/models/user'
import errorHandler from '~/server/utils/errorHandler'
import ApiFeatures from '~/server/utils/ApiFeatures'

export default async (req, res) => {
  res.statusCode = 200
  const params = useQuery(req)
  const cookies = useCookies(req)
  const urlPath = req.url.split('/')
  console.log('reqUrl', req.url)
  console.log('URLPATH', urlPath)
  console.log('PARAMS', params)
  console.log('PARAMS', params)

  const protect = async () => {
    if (!cookies.auth) {
      const newError = new Error(`You are not allowed to access these resources, please login`)
      newError.customError = true
      newError.statusCode = 401
      throw newError
    }
    const auth = JSON.parse(cookies.auth)

    if (!auth.token) {
      const newError = new Error(`You are not allowed to access these resources, please login`)
      newError.customError = true
      newError.statusCode = 401
      throw newError
    }
    const token = auth.token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    return user
  }

  const authorize = async (...roles) => {
    const user = await protect()
    if (!roles.includes(user.role)) return false
    return true
  }

  if (req.method === 'GET' && req.url.includes('/slug')) {
    console.log('PPPPP', params.slug)
    const doc = await Model.find({ slug: params.slug })
    console.log('DDDDD', doc)
    return doc.length ? doc[0] : null
  }

  if (req.method === 'GET') {
    let features
    try {
      const allDocs = await Model.find()
      features = new ApiFeatures(Model.find(), params).filter().fields().search().sort()
      const featured = await features.query
      features = new ApiFeatures(Model.find(), params).filter().fields().search().sort().paginate()
      const docs = await features.query
        .populate('gallery', { name: 1, path: 1, mimetype: 1 })
        .populate('categories', { name: 1, slug: 1 })
        .populate('attributes.attribute', { name: 1, slug: 1 })
        // .populate('attributes.terms', { name: 1, slug: 1, parent: 1 })
        // .populate('attributes.defaultTerm', { name: 1, slug: 1, parent: 1 })
        .populate({
          path: 'attributes',
          model: 'Attribute',
          populate: {
            path: 'terms',
            model: 'Attributeterm',
            populate: {
              path: 'parent',
              model: 'Attribute',
              // select: 'name slug',
            },
          },
        })
        .populate({
          path: 'attributes',
          model: 'Attribute',
          populate: {
            path: 'defaultTerm',
            model: 'Attributeterm',
            populate: {
              path: 'parent',
              model: 'Attribute',
              // select: 'name slug',
            },
          },
        })
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
      const user = await protect()
      if (!(await authorize('admin'))) {
        const newError = new Error(`You do not have adequate permisson to perform this action`)
        newError.customError = true
        newError.statusCode = 403
        throw newError
      }
      console.log('OOOOOOO', user)
      body.createdBy = user._id
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
