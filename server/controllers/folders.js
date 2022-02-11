import asyncHandler from '~/server/utils/asyncHandler'
import slugify from 'slugify'

const slugifyFolderName = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name, { lower: true })
  req.body.path = `/${req.body.slug}`
  next()
})

export { slugifyFolderName }
