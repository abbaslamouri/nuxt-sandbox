import { useBody, useQuery } from 'h3'

import Category from '~/server/models/category'

export default async (req, res) => {
	try {
		// xxx = 0
		// throw new Error('My Error', 400)
		// console.log(await useQuery(req))
		// const body = await useBody(req)
		const params = await useQuery(req)
		// console.log('Body', body)
		console.log('params', params)
		const id = req.url.split('/')[1]
		console.log(id)
		console.log('RM', req.method)
		const docs = await Category.findById(id)

		// return docs
		// const doc = await Category.create(body)
		// const doc = await Category.find()
		// if (!doc) throw new Error(`We are not able to create a new document`, 404)
		// const docs = await Category.find()
		res.statusCode = 200
		return docs
	} catch (error) {
		console.log('ERR', error.message)
		res.statusCode = 400
		res.end(error.message)
		// return error
	}
}
