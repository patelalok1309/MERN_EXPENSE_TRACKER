import { config } from 'dotenv';
config();

import { connectDB } from './db/index.js';
import app from './app.js';
const PORT = process.env.PORT;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running on port ${process.env.PORT}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});
