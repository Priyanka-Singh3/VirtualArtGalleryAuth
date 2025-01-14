import mongoose from 'mongoose'

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Database connected");
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/virtual_art_gallary_auth`)
}
export default connectDB;