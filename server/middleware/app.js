import mongoose from 'mongoose'
import colors from 'colors'

export default async (req, res) => {
  const mongoDB = async () => {
    try {
      const connect = await mongoose.connect(process.env.DB_URL, {})
      console.log(colors.magenta.bold(`Database connection succesfull at host: ${connect.connection.host}`))
    } catch (err) {
      console.log('Mongo DB Error', err)
      console.log('Mongo DB Error Message', err.message)
    }
  }
  mongoDB()
}
