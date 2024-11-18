import { User } from '../models/user.model.js';
import { ApiError, successResponse } from '../utils/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendMail } from '../services/emailService.js';
import crypto from 'crypto';

const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;

	// Validate required fields
	if (!username?.trim() || !email?.trim() || !password?.trim()) {
		throw new ApiError(400, 'Username, email, and password are required');
	}

	// Check if the user already exists
	let user = await User.findOne({ email });

	// Generate a verification code and expiry
	const code = generateVerificationCode();
	const verificationExpiry = Date.now() + 60 * 60 * 1000; // 1 hour expiry

	if (user) {
		if (user.isVerified) {
			throw new ApiError(400, 'User already exists and is verified');
		}

		// Update the user with a new verification code and expiry
		user.verificationCode = code;
		user.verificationCodeExpiry = verificationExpiry;
		await user.save();

		// Send the verification email
		await sendMail(user.email, code);

		return successResponse(
			res,
			200,
			'Verification email resent successfully. Check your inbox.',
			{ username: user.username, email: user.email }
		);
	}

	// Create a new user and send a verification email
	user = await User.create({
		username,
		email,
		password,
		verificationCode: code,
		verificationCodeExpiry: verificationExpiry,
	});

	await sendMail(user.email, code);

	return successResponse(
		res,
		201,
		'User created successfully. Please verify your account.',
		{ username: user.username, email: user.email }
	);
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	console.log(email, password);
	await sendMail(email, '746530');

	// Validate required fields
	if (!email?.trim() || !password?.trim()) {
		throw new ApiError(400, 'Email and password are required');
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(404, 'User not found');
	}

	if (!(await user.isPasswordCorrect(password))) {
		throw new ApiError(401, 'Invalid password');
	}

	if (!user.isVerified) {
		const code = generateVerificationCode();
		user.verificationCode = code;
		user.verificationCodeExpiry = Date.now() + 60 * 60 * 1000;
		await sendMail(user.email, code);
		await user.save();
		throw new ApiError(
			401,
			'Please verify your account , verification mail sent successfully'
		);
	}

	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();

	res.cookie('accessToken', accessToken, {
		httpOnly: false,
		maxAge: 24 * 60 * 60 * 1000,
	});
	res.cookie('refreshToken', refreshToken, {
		httpOnly: false,
		maxAge: 24 * 60 * 60 * 1000,
	});

	successResponse(res, 200, 'User logged in successfully', {
		username: user.username,
		email: user.email,
		userId: user._id,
	});
});

const verifyUser = asyncHandler(async (req, res) => {
	const { email, verificationCode } = req.body;

	if (!email.trim() || !verificationCode.toString().trim()) {
		throw new ApiError(
			400,
			'Email address and verification codes are required to verify user'
		);
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(404, 'User not found');
	}

	if (user.isVerified) {
		throw new ApiError(400, 'User is already verified , please try to login');
	}

	if (
		user.verificationCodeExpiry > Date.now() &&
		user.verificationCode === verificationCode
	) {
		user.isVerified = true;
	} else {
		throw new ApiError(400, 'Invalid verification code');
	}

	await user.save();

	successResponse(res, 200, 'User Verified successfully');
});

const generateVerificationCode = () => {
	const code = crypto.randomInt(100000, 999999);
	return code.toString();
};

export { registerUser, loginUser, verifyUser };
