import mongoose, { modelNames } from 'mongoose';

export const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(
			`${process.env.MONGO_URI}`
		);
		console.log(
			`MongoDB connected successfully ! DB HOST : ${connectionInstance.connection.host}`
		);
	} catch (error) {
		console.log('MongoDB connection failed !', error);
		process.exit(1);
	}
};

export default connectDB;
