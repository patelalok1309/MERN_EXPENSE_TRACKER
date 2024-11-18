import { Account } from '../models/account.model.js';
import { User } from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError, successResponse } from '../utils/index.js';

export const createAccount = asyncHandler(async (req, res) => {
	const { name, type, balance, createdBy, imageUrl } = req.body;

	if (!name || !type || !balance || !createdBy) {
		throw new ApiError(400, 'All fields are required');
	}

	const owner = await User.findOne({
		_id: createdBy,
	});

	if (!owner) {
		throw new ApiError(404, 'User not found');
	}

	const account = await Account.create({
		name,
		type,
		balance,
		createdBy,
		imageUrl,
	});

	owner.accounts.push(account._id);

	await owner.save();

	successResponse(res, 201, 'Account created Successfully', account);
});

export const getAccounts = asyncHandler(async (req, res) => {
	const accounts = await Account.find({ createdBy: req.user._id });

	if (accounts.length === 0) {
		throw new ApiError(404, 'No accounts found');
	}

	successResponse(res, 200, 'Accounts fetched successfully', accounts);
});

export const updateAccountById = asyncHandler(async (req, res) => {
	const { name, type, balance, imageUrl } = req.body;

	const account = await Account.findOne(req.accountId);

	if (!account) {
		throw new ApiError(404, 'Account not found');
	}

	account.name = name;
	account.type = type;
	account.balance = balance;
	account.imageUrl = imageUrl;

	const updatedAccount = await account.save();

	successResponse(res, 200, 'Account updated successfully', updatedAccount);
});

export const deleteAccountById = asyncHandler(async (req, res) => {
	const { accountId } = req.body;

	if (!accountId) {
		throw new ApiError(400, 'AccountId is required');
	}

	const deletedAccount = await Account.deleteOne({ _id: accountId });

	if (deletedAccount.deletedCount === 0) {
		throw new ApiError(404, 'Account not found');
	}

	await User.updateMany(
		{ accounts: accountId },
		{ $pull: { accounts: accountId } }
	);

	successResponse(res, 200, 'Account deleted successfully', deletedAccount);
});
