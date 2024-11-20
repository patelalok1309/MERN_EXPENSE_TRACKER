import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import bodyParser from 'body-parser';
const app = express();

// Routes imports
import authRoutes from './routes/auth.route.js';
import accountRoutes from './routes/account.route.js';
import incomeRoutes from './routes/income.route.js';

// Middlewares
app.use(
	cors({
		origin: '*',
		credentials: true,
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Site health check
app.get('/check-health', (req, res) => {
	res.send('I am healthy');
});

// Route Declarations
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/income', incomeRoutes);

// ApiError Middleware
app.use(errorHandler);

export default app;
