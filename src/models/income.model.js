import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	dateTime: {
		type: Date,
		required: true,
		validate: {
			validator: (v) => !isNaN(Date.parse(v)),
			message: (props) => `${props.value} is not a valid Date-time!`,
		},
	},
	account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
	},
	category: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

incomeSchema.index({ account: 1 });

const Income = mongoose.model('Income', incomeSchema);

export default Income;
