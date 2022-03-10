import errorHandler from '~/server/utils/errorHandler'

const fetchBySlug = async (Model, slug) => {
  try {
    const doc = await Model.find({ slug }).select('-createdAt -updatedAt -__v').populate({
      model: 'Media',
      path: 'gallery',
      select: '-mimetype -createdAt -updatedAt -size -folder -__v',
    })
    if (!doc) {
      const newError = new Error(`We are not able to create a new document`)
      newError.customError = true
      newError.statusCode = 404
      throw newError
    }
    console.log('LLLLL', doc)
    return doc.length ? doc[0] : {}
  } catch (error) {
    return errorHandler(error)
  }
}

export { fetchBySlug }
