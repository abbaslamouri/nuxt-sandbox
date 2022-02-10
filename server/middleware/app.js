import mongoose from 'mongoose'
import colors from 'colors'
import config from '#config'

export default async (req, res) => {
	const mongoDB = async () => {
		try {
			const connect = await mongoose.connect(config.DB_URL, {})
			console.log(colors.magenta.bold(`Database connection succesfull at host: ${connect.connection.host}`))
		} catch (err) {
			console.log(colors.red.bold('Mongo DB Error', err))
			console.log(colors.red.bold('Mongo DB Error Message', err.message))
		}
	}
	mongoDB()
}
