import mongoose, { Schema } from 'mongoose';
import Income from './income.model.js';

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
	incomes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Income',
		},
	],
});

accountSchema.pre(
	'deleteOne',
	{ document: true, query: false },
	async function (next) {
		try {
			// Delete all the incomes associated with this account
			await Income.deleteMany({ account: this._id });
			next();
		} catch (error) {
			next(error);
		}
	}
);

export const Account = mongoose.model('Account', accountSchema);
