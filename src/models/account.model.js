import mongoose, { Schema } from 'mongoose';

const accountSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	type: {
		type: String,
		enum: ['Cash', 'UPI', 'Credit card', 'Debit card', 'Wallet', 'Other'],
		default: 'Cash',
	},
	balance: {
		type: Number,
		required: true,
		default: 0,
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	imageUrl: {
		type: String,
	},
});

export const Account = mongoose.model('Account', accountSchema);
