import mongoose from 'mongoose';
import { Account } from '../models/account.model.js';
import Income from '../models/income.model.js';
import { User } from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError, successResponse } from '../utils/index.js';
import moment from 'moment';

export const createIncome = asyncHandler(async (req, res) => {
	const {
		name,
		amount,
		accountId,
		dateTime,
		category,
		description,
		createdBy,
	} = req.body;

	if (
		!name ||
		!amount ||
		!accountId ||
		!dateTime ||
		!category ||
		!description ||
		!createdBy
	) {
		throw new ApiError(400, 'All fields are required');
	}

	const owner = await User.findOne({
		_id: createdBy,
	});

	if (!owner) {
		throw new ApiError(404, 'User not found');
	}

	const validDateTime = moment(dateTime, moment.ISO_8601, true);
	if (!validDateTime.isValid()) {
		throw new ApiError(400, 'Invalid date time');
	}

	const account = await Account.findOne({ _id: accountId });

	if (!account) {
		throw new ApiError(404, 'Account not found');
	}

	const income = await Income.create({
		name,
		amount,
		dateTime,
		account,
		createdBy,
		category,
		description,
	});

	account.balance += amount;
	account.incomes.push(income._id);

	await account.save();

	successResponse(res, 200, 'Income created Successfully', income);
});

export const updateIncome = asyncHandler(async (req, res) => {
	const { incomeId, name, amount, dateTime, category, description } = req.body;

	if (!incomeId || !amount) {
		throw new ApiError(400, 'Income id and amount fields are required');
	}

	// Start a session for transaction
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const income = await Income.findById(incomeId).populate('account');

		if (!income) {
			throw new ApiError(404, 'Income not found');
		}

		const account = income.account;

		if (!account) {
			throw new ApiError(404, 'Linked Account not found');
		}

		account.balance = account.balance - income.amount + amount;

		await account.save({ session });

		income.amount = amount;
		income.name = name;
		income.dateTime = dateTime;
		income.category = category;
		income.description = description;

		const updateIncome = await income.save({ session });

		await session.commitTransaction();

		successResponse(res, 200, 'Income updated successfully', updateIncome);
	} catch (error) {
		console.log(error);
		await session.abortTransaction();
		throw new ApiError(500, 'An error occured while updating income');
	} finally {
		session.endSession();
	}
});

export const deleteIncome = asyncHandler(async (req, res) => {
	const { incomeId } = req.body;

	if (!incomeId) {
		throw new ApiError(400, 'Income id is required');
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const deletedIncome =
			await Income.findByIdAndDelete(incomeId).session(session);

		if (!deletedIncome) {
			throw new ApiError(404, 'Income not found');
		}

		const updatedAccount = await Account.findOneAndUpdate(
			{ incomes: incomeId },
			{
				$pull: { incomes: incomeId },
				$inc: { balance: -deletedIncome.amount },
			}
		).session(session);

		await session.commitTransaction();

		successResponse(res, 200, 'Income deleted successfully');
	} catch (error) {
		await session.abortTransaction();
		throw new ApiError(500, 'An error occured while deleting income');
	} finally {
		session.endSession();
	}
});

export const getIncomeById = asyncHandler(async (req, res) => {
	const { incomeId } = req.body;

	if (!incomeId) {
		throw new ApiError(400, 'Income id is required');
	}

	const income = await Income.findById(incomeId);

	if (!income) {
		throw new ApiError(404, 'Income not found');
	}

	successResponse(res, 200, 'Income found successfully', income);
});
